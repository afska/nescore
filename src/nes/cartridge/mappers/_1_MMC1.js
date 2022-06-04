import Mapper from "./Mapper";
import { WithCompositeMemory, MemoryChunk, MemoryPadding } from "../../memory";
import { InMemoryRegister } from "../../registers";
import constants from "../../constants";

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
		const prgRam = new MemoryChunk(0x2000);
		const prgRomBank0 = this._newPrgBank();
		const prgRomBank1 = this._newPrgBank(this.prgPages.length - 1);

		this.prgRam = prgRam;
		this._prgRomBank0 = prgRomBank0;
		this._prgRomBank1 = prgRomBank1;
		this._state = {
			load: new LoadRegister(),
			control: new ControlRegister(),
			chrBank0: new CHRBank0Register(),
			chrBank1: new CHRBank1Register(),
			prgBank: new PRGBankRegister()
		};

		return WithCompositeMemory.createSegment([
			//                Address range   Size      Description
			unused, //        $4020-$5FFF     $1FE0     Unused space
			prgRam, //        $6000-$7FFF     $2000     PRG RAM (optional)
			prgRomBank0, //   $8000-$BFFF     $4000     PRG ROM (switchable or fixed to first bank)
			prgRomBank1 //    $C000-$FFFF     $4000     PRG ROM (switchable or fixed to last bank)
		]);
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment({ cartridge }) {
		this._chrRomBank0 = this._newChrBank(cartridge);
		this._chrRomBank1 = this._newChrBank(cartridge);

		return WithCompositeMemory.createSegment([
			//                    Address range   Size      Description
			this._chrRomBank0, // $0000-$0FFF     $1000     CHR ROM (switchable)
			this._chrRomBank1 //  $1000-$1FFF     $1000     CHR ROM (switchable)
		]);
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		if (address >= 0x8000) {
			// Load
			const value = this._state.load.write(byte);
			if (value == null) return;

			if (address >= 0x8000 && address < 0xa000) {
				// Control
				this._state.control.setValue(value);
				this.context.ppu.memory.changeNameTablesMirroringTo(
					this._state.control.mirroring
				);
			} else if (address >= 0xa000 && address < 0xc000) {
				// CHR bank 0
				this._state.chrBank0.setValue(value);
			} else if (address >= 0xc000 && address < 0xe000) {
				// CHR bank 1
				this._state.chrBank1.setValue(value);
			} else {
				// PRG bank
				this._state.prgBank.setValue(value);
			}

			this._loadBanks();
			return;
		}

		this.context.cpu.memory.writeAt(address, byte);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			loadShiftRegister: this._state.load.shiftRegister,
			loadWriteCounter: this._state.load.writeCounter,
			control: this._state.control.value,
			chrBank0: this._state.chrBank0.value,
			chrBank1: this._state.chrBank1.value,
			prgBank: this._state.prgBank.value
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this._state.load.shiftRegister = saveState.loadShiftRegister;
		this._state.load.loadWriteRegister = saveState.loadWriteRegister;
		this._state.control.setValue(saveState.control);
		this._state.chrBank0.setValue(saveState.chrBank0);
		this._state.chrBank1.setValue(saveState.chrBank1);
		this._state.prgBank.setValue(saveState.prgBank);
	}

	_loadBanks() {
		const { control, chrBank0, chrBank1, prgBank } = this._state;

		if (control.isPrgRom32Kb) {
			// 32KB PRG
			const page = prgBank.prgRomBankId & 0b1110;
			this._prgRomBank0.bytes = this._getPrgPage(page);
			this._prgRomBank1.bytes = this._getPrgPage(page + 1);
		} else {
			// 16KB PRG
			this._prgRomBank0.bytes = this._getPrgPage(
				control.isFirstPrgAreaSwitchable ? prgBank.prgRomBankId : 0
			);
			this._prgRomBank1.bytes = this._getPrgPage(
				control.isSecondPrgAreaSwitchable
					? prgBank.prgRomBankId
					: this.prgPages.length - 1
			);
		}

		if (control.isChrRom8Kb) {
			// 8KB CHR
			const page = chrBank0.value & 0b11110;
			this._chrRomBank0.bytes = this._getChrPage(page);
			this._chrRomBank1.bytes = this._getChrPage(page + 1);
		} else {
			// 4KB CHR
			this._chrRomBank0.bytes = this._getChrPage(chrBank0.value);
			this._chrRomBank1.bytes = this._getChrPage(chrBank1.value);
		}
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
		this.shiftRegister = 0;
		this.writeCounter = 0;
	}

	/** Writes a bit. Returns null 4 times, then the full value. */
	write(byte) {
		if (byte & 0b10000000) {
			// reset
			this.shiftRegister = 0b10000;
			this.writeCounter = 0;

			return null;
		} else {
			// shift 4 times, writing on the 5th

			const bit = byte & 1;
			this.shiftRegister = ((this.shiftRegister >> 1) | (bit << 4)) & 0b11111;
			this.writeCounter++;

			if (this.writeCounter === 5) {
				const value = this.shiftRegister;
				this.shiftRegister = 0;
				this.writeCounter = 0;
				return value;
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

		this.addReadOnlyField("mirroringId", 0, 2)
			.addReadOnlyField("prgRomBankMode", 2, 2)
			.addReadOnlyField("chrRomBankMode", 4);
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
 * +----- PRG RAM chip enable (0: enabled; 1: disabled) (unused on this emulator)
 */
class PRGBankRegister extends InMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("prgRomBankId", 0, 4);
	}
}
