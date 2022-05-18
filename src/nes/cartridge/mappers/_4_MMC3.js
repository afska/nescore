import Mapper from "./Mapper";
import { interrupts } from "../../cpu/constants";
import { MemoryChunk, MemoryPadding, WithCompositeMemory } from "../../memory";
import { InMemoryRegister } from "../../registers";
import constants from "../../constants";

/**
 * It provides bank-switching for PRG and CHR ROM.
 * CPU $6000-$7FFF: 8 KB PRG RAM bank (optional)
 * CPU $8000-$9FFF (or $C000-$DFFF): 8 KB switchable PRG ROM bank
 * CPU $A000-$BFFF: 8 KB switchable PRG ROM bank
 * CPU $C000-$DFFF (or $8000-$9FFF): 8 KB PRG ROM bank, fixed to the second-last bank
 * CPU $E000-$FFFF: 8 KB PRG ROM bank, fixed to the last bank
 * PPU $0000-$07FF (or $1000-$17FF): 2 KB switchable CHR bank
 * PPU $0800-$0FFF (or $1800-$1FFF): 2 KB switchable CHR bank
 * PPU $1000-$13FF (or $0000-$03FF): 1 KB switchable CHR bank
 * PPU $1400-$17FF (or $0400-$07FF): 1 KB switchable CHR bank
 * PPU $1800-$1BFF (or $0800-$0BFF): 1 KB switchable CHR bank
 * PPU $1C00-$1FFF (or $0C00-$0FFF): 1 KB switchable CHR bank
 * This mapper allows even more PRG and CHR banks to be selected, but doesn’t have the
 * 5-write-quirk of MMC1. It does, though, have a scanline counter, which can trigger
 * an IRQ on decrementing.
 */
export default class MMC3 extends Mapper {
	static get id() {
		return 4;
	}

	constructor() {
		super(8 * constants.KB, 1 * constants.KB);
	}

	/** Creates a memory segment for CPU range $4020-$FFFF. */
	createCPUSegment() {
		const unused = new MemoryPadding(0x1fe0);
		const prgRam = new MemoryChunk(0x2000);
		const prgRomBank0 = this._newPrgBank();
		const prgRomBank1 = this._newPrgBank();
		const prgRomBank2 = this._newPrgBank();
		const prgRomBank3 = this._newPrgBank(this.prgPages.length - 1);

		this._prgRomBank0 = prgRomBank0;
		this._prgRomBank1 = prgRomBank1;
		this._prgRomBank2 = prgRomBank2;

		this._state = {
			bankSelect: new BankSelectRegister(),
			bankData: [0, 0, 0, 0, 0, 0, 0],
			irqEnabled: false,
			irqLatch: 0,
			irqCountdown: 0
		};

		return WithCompositeMemory.createSegment([
			//              Address range   Size      Description
			unused, //      $4020-$5FFF     $1FE0     Unused space
			prgRam, //      $6000-$7FFF     $2000     PRG RAM (optional)
			prgRomBank0, // $8000-$9FFF     $2000     PRG ROM (switchable or fixed to second-last bank)
			prgRomBank1, // $A000-$BFFF     $2000     PRG ROM (switchable)
			prgRomBank2, // $C000-$DFFF     $2000     PRG ROM (switchable or fixed to second-last bank)
			prgRomBank3 //  $E000-$FFFF     $2000     PRG ROM (fixed to last bank)
		]);
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment({ cartridge }) {
		this._chrRomBank0 = this._newChrBank(cartridge);
		this._chrRomBank1 = this._newChrBank(cartridge);
		this._chrRomBank2 = this._newChrBank(cartridge);
		this._chrRomBank3 = this._newChrBank(cartridge);
		this._chrRomBank4 = this._newChrBank(cartridge);
		this._chrRomBank5 = this._newChrBank(cartridge);
		this._chrRomBank6 = this._newChrBank(cartridge);
		this._chrRomBank7 = this._newChrBank(cartridge);

		return WithCompositeMemory.createSegment([
			//                    Address range   Size      Description
			this._chrRomBank0, // $0000-$03FF     $400      CHR ROM (switchable)
			this._chrRomBank1, // $0400-$07FF     $400      CHR ROM (switchable)
			this._chrRomBank2, // $0800-$0BFF     $400      CHR ROM (switchable)
			this._chrRomBank3, // $0C00-$0FFF     $400      CHR ROM (switchable)
			this._chrRomBank4, // $1000-$13FF     $400      CHR ROM (switchable)
			this._chrRomBank5, // $1400-$17FF     $400      CHR ROM (switchable)
			this._chrRomBank6, // $1800-$1BFF     $400      CHR ROM (switchable)
			this._chrRomBank7 //  $1C00-$1FFF     $400      CHR ROM (switchable)
		]);
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		// (the writes are differentiated in even and odd, depending on `address`)
		const isEven = address % 2 === 0;

		if (address >= 0x8000 && address < 0x9fef) {
			const { bankSelect } = this._state;

			if (isEven) {
				// Writes to Bank select register
				bankSelect.value = byte;
			} else {
				// Writes the page of the bank that was select with the even write before
				this._state.bankData[bankSelect.bankRegister] = byte;
			}

			this._loadPRGBanks();
			this._loadCHRBanks();
			return;
		} else if (address >= 0xa000 && address < 0xbfff) {
			if (isEven) {
				// Mirroring
				// This changes the Name table mirroring type.
				this.context.ppu.memory.changeNameTablesMirroringTo(
					byte & 1 ? "HORIZONTAL" : "VERTICAL"
				);
			}
		} else if (address >= 0xc000 && address < 0xe000) {
			if (isEven) {
				// IRQ latch
				// This register holds the value, that will be loaded into the actual
				// scanline counter when a reload is forced, or when the counter reached zero.
				this._state.irqLatch = byte;
			} else {
				// IRQ reload
				// This register resets the actual scanline counter, and will push the
				// IRQ latch value to the counter in the next scanline.
				this._state.irqCountdown = 0;
			}
		} else if (address >= 0xe000) {
			if (isEven) {
				// IRQ disable
				// Writing to this register will disable the IRQ generation.
				this._state.irqEnabled = false;
			} else {
				// IRQ enable
				// Writing to this address area will enable IRQ generation again.
				this._state.irqEnabled = true;
			}
		}

		this.context.cpu.memory.writeAt(address, byte);
	}

	/** Runs at cycle 260 of every scanline (including preline). Returns a CPU interrupt or null. */
	tick() {
		if (this._state.irqCountdown === 0) {
			this._state.irqCountdown = this._state.irqLatch;
		} else {
			this._state.irqCountdown--;

			if (this._state.irqCountdown === 0 && this._state.irqEnabled)
				return interrupts.IRQ;
		}

		return null;
	}

	_loadPRGBanks() {
		const { bankSelect, bankData } = this._state;

		if (bankSelect.prgRomBankMode === 0) {
			this._prgRomBank0.bytes = this._getPrgPage(bankData[6]);
			this._prgRomBank1.bytes = this._getPrgPage(bankData[7]);
			this._prgRomBank2.bytes = this._getPrgPage(this.prgPages.length - 2);
		} else {
			this._prgRomBank0.bytes = this._getPrgPage(this.prgPages.length - 2);
			this._prgRomBank1.bytes = this._getPrgPage(bankData[7]);
			this._prgRomBank2.bytes = this._getPrgPage(bankData[6]);
		}

		/**
		 * PRG map mode | $8000.D6 = 0 | $8000.D6 = 1
		 * ------------------------------------------
		 * CPU Bank     | Value of MMC3 register
		 * ------------------------------------------
		 * $8000-$9FFF  | R6           | (-2)
		 * $A000-$BFFF  | R7           | R7
		 * $C000-$DFFF  | (-2)         | R6
		 * $E000-$FFFF  | (-1)         | (-1)
		 *
		 * (-1) : the last bank
		 * (-2) : the second last bank
		 */
	}

	_loadCHRBanks() {
		const { bankSelect, bankData } = this._state;

		const r0 = bankData[0] & 0b11111110;
		const r1 = bankData[1] & 0b11111110;

		if (bankSelect.chrRomA12Inversion === 0) {
			this._chrRomBank0.bytes = this._getChrPage(r0);
			this._chrRomBank1.bytes = this._getChrPage(r0 + 1);
			this._chrRomBank2.bytes = this._getChrPage(r1);
			this._chrRomBank3.bytes = this._getChrPage(r1 + 1);
			this._chrRomBank4.bytes = this._getChrPage(bankData[2]);
			this._chrRomBank5.bytes = this._getChrPage(bankData[3]);
			this._chrRomBank6.bytes = this._getChrPage(bankData[4]);
			this._chrRomBank7.bytes = this._getChrPage(bankData[5]);
		} else {
			this._chrRomBank0.bytes = this._getChrPage(bankData[2]);
			this._chrRomBank1.bytes = this._getChrPage(bankData[3]);
			this._chrRomBank2.bytes = this._getChrPage(bankData[4]);
			this._chrRomBank3.bytes = this._getChrPage(bankData[5]);
			this._chrRomBank4.bytes = this._getChrPage(r0);
			this._chrRomBank5.bytes = this._getChrPage(r0 + 1);
			this._chrRomBank6.bytes = this._getChrPage(r1);
			this._chrRomBank7.bytes = this._getChrPage(r1 + 1);
		}

		/**
		 * CHR map mode | $8000.D7 = 0 | $8000.D7 = 1
		 * ------------------------------------------
		 * PPU Bank	    | Value of MMC3 register
		 * ------------------------------------------
		 * $0000-$03FF  | R0           | R2
		 * $0400-$07FF  | ^^           | R3
		 * $0800-$0BFF  | R1           | R4
		 * $0C00-$0FFF  | ^^           | R5
		 * $1000-$13FF  | R2           | R0
		 * $1400-$17FF  | R3           | ^^
		 * $1800-$1BFF  | R4           | R1
		 * $1C00-$1FFF  | R5           | ^^
		 */
	}
}

/**
 * Bank select ($8000-$9FEE, even address)
 * ---- ----
 * CPMx xRRR
 * |||   |||
 * |||   +++- Specify which bank register to update on next write to Bank Data register
 * |||          000: R0: Select 2 KB CHR bank at PPU $0000-$07FF (or $1000-$17FF)
 * |||          001: R1: Select 2 KB CHR bank at PPU $0800-$0FFF (or $1800-$1FFF)
 * |||          010: R2: Select 1 KB CHR bank at PPU $1000-$13FF (or $0000-$03FF)
 * |||          011: R3: Select 1 KB CHR bank at PPU $1400-$17FF (or $0400-$07FF)
 * |||          100: R4: Select 1 KB CHR bank at PPU $1800-$1BFF (or $0800-$0BFF)
 * |||          101: R5: Select 1 KB CHR bank at PPU $1C00-$1FFF (or $0C00-$0FFF)
 * |||          110: R6: Select 8 KB PRG ROM bank at $8000-$9FFF (or $C000-$DFFF)
 * |||          111: R7: Select 8 KB PRG ROM bank at $A000-$BFFF
 * ||+------- Nothing on the MMC3, see MMC6
 * |+-------- PRG ROM bank mode (0: $8000-$9FFF swappable,
 * |                                $C000-$DFFF fixed to second-last bank;
 * |                             1: $C000-$DFFF swappable,
 * |                                $8000-$9FFF fixed to second-last bank)
 * +--------- CHR A12 inversion (0: two 2 KB banks at $0000-$0FFF,
                                 four 1 KB banks at $1000-$1FFF;
                              1: two 2 KB banks at $1000-$1FFF,
                                 four 1 KB banks at $0000-$0FFF)
 */
class BankSelectRegister extends InMemoryRegister {
	constructor() {
		super();

		this.addField("bankRegister", 0, 3)
			.addField("prgRomBankMode", 6)
			.addField("chrRomA12Inversion", 7);
	}
}
