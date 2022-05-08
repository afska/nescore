import Mapper from "./Mapper";
import { MemoryPadding, WithCompositeMemory } from "../../memory";

/**
 * It provide bank-switching capabilities, just by writing a byte to any address on PRG ROM space.
 * CPU $8000-$BFFF: 16 KB switchable PRG ROM bank
 * CPU $C000-$FFFF: 16 KB PRG ROM bank, fixed to the last page
 * The CHR memory is usually RAM, mapped at PPU addresses $0000-$1FFF.
 */
export default class UxROM extends Mapper {
	static get id() {
		return 2;
	}

	/** Creates a memory segment for CPU range $4020-$FFFF. */
	createCPUSegment() {
		const unused = new MemoryPadding(0x3fe0);
		const prgRomSelectedPage = this._newPrgBank();
		const prgRomLastPage = this._newPrgBank(this.prgPages.length - 1);

		this._prgRomSwitchableBank = prgRomSelectedPage;

		return WithCompositeMemory.createSegment([
			//                     Address range   Size      Description
			unused, //             $4020-$7999     $3FE0     Unused space
			prgRomSelectedPage, // $8000-$BFFF     $4000     PRG ROM (switchable)
			prgRomLastPage //      $C000-$FFFF     $4000     PRG ROM (fixed to last bank)
		]);
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment({ cartridge }) {
		return this._newChrBank(cartridge);
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		if (address >= 0x8000) {
			this._prgRomSwitchableBank.bytes = this._getPrgPage(byte);
			return;
		}

		this.context.cpu.memory.writeAt(address, byte);
	}
}
