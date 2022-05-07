import Mapper from "./Mapper";
import { MemoryChunk, MemoryPadding, WithCompositeMemory } from "../../memory";
import { InMemoryRegister } from "../../registers";
import constants from "../../constants";
import _ from "lodash";

/**
 * It provides bank-switching for PRG and CHR ROM.
 * CPU $6000-$7FFF: 8 KB PRG RAM bank (optional)
 * CPU $8000-$BFFF: 16 KB PRG ROM bank, either switchable or fixed to the first bank
 * CPU $C000-$FFFF: 16 KB PRG ROM bank, either fixed to the last bank or switchable
 * PPU $0000-$0FFF: 4 KB switchable CHR bank
 * PPU $1000-$1FFF: 4 KB switchable CHR bank
 * Through writes to the MMC1 control register, it is possible for the program to
 * swap the fixed and switchable PRG ROM banks or to set up 32 KB PRG bankswitching.
 */
export default class MMC1 extends Mapper {
	static get id() {
		return 1;
	}

	constructor() {
		super(constants.PRG_ROM_PAGE_SIZE, 4 * constants.KB);
	}

	/** Creates a memory segment for CPU range $4020-$FFFF. */
	createCPUSegment() {
		const unused = new MemoryPadding(0x1fe0);
		const disabledPrgRam = new MemoryPadding(0x2000);
		const enabledPrgRam = new MemoryChunk(0x2000);
		const prgRomBank0 = new MemoryChunk(_.first(this.prgPages));
		const prgRomBank1 = new MemoryChunk(_.last(this.prgPages));
		prgRomBank0.readOnly = true;
		prgRomBank1.readOnly = true;

		this._disabledPrgRam = disabledPrgRam;
		this._enabledPrgRam = enabledPrgRam;
		this._prgRomBank0 = prgRomBank0;
		this._prgRomBank1 = prgRomBank1;
		this._registers = {
			load: new LoadRegister(),
			control: new ControlRegister(),
			chrBank0: new CHRBank0Register(),
			chrBank1: new CHRBank1Register(),
			prgBank: new PRGBankRegister()
		};

		return WithCompositeMemory.createSegment([
			//                      Address range   Size      Description
			unused, //              $4020-$5FFF     $1FE0     Unused space
			enabledPrgRam, //       $6000-$7FFF     $2000     PRG RAM (optional)
			prgRomBank0, //         $8000-$BFFF     $4000     PRG ROM (switchable or fixed to first bank)
			prgRomBank1 //          $C000-$FFFF     $4000     PRG ROM (switchable or fixed to last bank)
		]);
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment({ cartridge }) {
		const chrRomBank0 = new MemoryChunk(_.first(this.chrPages));
		const chrRomBank1 = new MemoryChunk(_.last(this.chrPages));
		chrRomBank0.readOnly = !cartridge.header.usesChrRam;
		chrRomBank1.readOnly = !cartridge.header.usesChrRam;

		this._chrRomBank0 = chrRomBank0;
		this._chrRomBank1 = chrRomBank1;

		return WithCompositeMemory.createSegment([
			//                      Address range   Size      Description
			chrRomBank0, //         $0000-$0FFF     $1000     CHR ROM (switchable)
			chrRomBank1 //          $1000-$1FFF     $1000     CHR ROM (switchable)
		]);
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		if (address >= 0x8000) {
			const value = this._registers.load.write(byte);
			if (value == null) return;

			if (address >= 0x8000 && address < 0xa000) {
				this._registers.control.value = value;
				this.context.ppu.memory.changeNameTablesMirroringTo(
					this._registers.control.mirroring
				);
			} else if (address >= 0xa000 && address < 0xc000) {
				this._registers.chrBank0.value = value;
			} else if (address >= 0xc000 && address < 0xe000) {
				this._registers.chrBank1.value = value;
			} else {
				this._registers.prgBank.value = value;
				this._prgRam = this._registers.prgBank.prgRamEnable
					? this._enabledPrgRam
					: this._disabledPrgRam;
			}

			this._loadBanks();
			return;
		}

		this.context.cpu.memory.writeAt(address, byte);
	}

	_loadBanks() {
		const { control, chrBank0, chrBank1, prgBank } = this._registers;

		if (control.isPrgRom32Kb) {
			// 32KB PRG
			const page = prgBank.prgRomBankId & 0b1110;
			this._prgRomBank0.bytes = this.prgPages[page];
			this._prgRomBank1.bytes = this.prgPages[page + 1];
		} else {
			// 16KB PRG
			this._prgRomBank0.bytes = control.isFirstPrgAreaSwitchable
				? this.prgPages[prgBank.prgRomBankId]
				: _.first(this.prgPages);
			this._prgRomBank1.bytes = control.isSecondPrgAreaSwitchable
				? this.prgPages[prgBank.prgRomBankId]
				: _.last(this.prgPages);
		}

		if (control.isChrRom8Kb) {
			// 8KB CHR
			const page = chrBank0.value & 0b11110;
			this._chrRomBank0.bytes = this.chrPages[page];
			this._chrRomBank0.bytes = this.chrPages[page + 1];
		} else {
			// 4KB CHR
			this._chrRomBank0.bytes = this.chrPages[chrBank0.value];
			this._chrRomBank1.bytes = this.chrPages[chrBank1.value];
		}
	}

	get _prgRam() {
		return this.segments.cpu.chunks[1];
	}

	set _prgRam(value) {
		this.segments.cpu.chunks[1] = value;
	}
}

/**
 * Load Register ($8000-$FFFF)
 * MMC1 has a quirk, where it will take 5 writes to collect all the bits for the actual write
 * that sets a bank. These 5 writes all are made to the Load register ($8000-$FFFF) that
 * consists of a shift register. Each write to the load register shifts the rightmost bit onto
 * said shift register, and on the 5th write, the whole shift register is evaluated.
 */
class LoadRegister {
	constructor() {
		this._value = 0;
		this._shiftRegister = 0;
		this._writeCounter = 0;
	}

	/** Writes a bit. Returns null 4 times, then the full value. */
	write(byte) {
		if (byte & 0b10000000) {
			// reset
			this._shiftRegister = 0b10000;
			this._writeCounter = 0;

			return null;
		} else {
			// shift 4 times, writing on the 5th

			const bit = byte & 1;
			this._shiftRegister = ((this._shiftRegister >> 1) | (bit << 4)) & 0b11111;
			this._writeCounter++;

			if (this._writeCounter === 5) {
				this._shiftRegister = 0;
				this._writeCounter = 0;
				return this._value;
			}

			return null;
		}
	}
}

/**
 * Control ($8000-$9FFF)
 * -----
 * CPPMM
 * |||||
 * |||++- Mirroring (0: one-screen, lower bank; 1: one-screen, upper bank;
 * |||               2: vertical; 3: horizontal)
 * |++--- PRG ROM bank mode (0, 1: switch 32 KB at $8000, ignoring low bit of bank number;
 * |                         2: fix first bank at $8000 and switch 16 KB bank at $C000;
 * |                         3: fix last bank at $C000 and switch 16 KB bank at $8000)
 * +----- CHR ROM bank mode (0: switch 8 KB at a time; 1: switch two separate 4 KB banks)
 */
class ControlRegister extends InMemoryRegister {
	constructor() {
		super();

		this.addField("mirroringId", 0, 2)
			.addField("prgRomBankMode", 2, 2)
			.addField("chrRomBankMode", 4);
	}

	/** Returns the mirroring type. */
	get mirroring() {
		switch (this.mirroringId) {
			case 0:
				return "ONE_SCREEN_LOWER_BANK";
			case 1:
				return "ONE_SCREEN_UPPER_BANK";
			case 2:
				return "VERTICAL";
			case 3:
			default:
				return "HORIZONTAL";
		}
	}

	/** Returns whether the PRG ROM area is 32KB or not (16KB otherwise). */
	get isPrgRom32Kb() {
		return this.prgRomBankMode <= 1;
	}

	/** Returns whether the CHR ROM area is 8KB or not (4KB otherwise). */
	get isChrRom8Kb() {
		return this.chrRomBankMode === 0;
	}

	/** Returns true if the first PRG ROM area ($8000-$BFFF) is switchable. Otherwise, it's fixed to first bank. */
	get isFirstPrgAreaSwitchable() {
		return this.prgRomBankMode !== 2;
	}

	/** Returns true if the second PRG ROM area ($C000-$FFFF) is switchable. Otherwise, it's fixed to last bank. */
	get isSecondPrgAreaSwitchable() {
		return this.prgRomBankMode !== 3;
	}
}

/**
 * CHR bank 0 ($A000-$BFFF)
 * -----
 * CCCCC
 * |||||
 * +++++- Select 4 KB or 8 KB CHR bank at PPU $0000 (low bit ignored in 8 KB mode)
 */
class CHRBank0Register extends InMemoryRegister {}

/**
 * CHR bank 1 ($C000-$DFFF)
 * -----
 * CCCCC
 * |||||
 * +++++- Select 4 KB CHR bank at PPU $1000 (ignored in 8 KB mode)
 */
class CHRBank1Register extends InMemoryRegister {}

/**
 * PRG bank ($E000-$FFFF)
 * -----
 * RPPPP
 * |||||
 * |++++- Select 16 KB PRG ROM bank (low bit ignored in 32 KB mode)
 * +----- PRG RAM chip enable (0: enabled; 1: disabled)
 */
class PRGBankRegister extends InMemoryRegister {
	constructor() {
		super();

		this.addField("prgRomBankId", 0, 4).addField("prgRamEnable", 4);
	}
}
