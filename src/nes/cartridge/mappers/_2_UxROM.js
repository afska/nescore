import Mapper from "./Mapper";
import { MemoryChunk, MemoryPadding, WithCompositeMemory } from "../../memory";
import _ from "lodash";

/**
 * It provide bank-switching capabilities, just by writing a byte to any address on PRG-ROM space.
 * CPU $8000-$BFFF: 16 KB switchable PRG-ROM bank
 * CPU $C000-$FFFF: 16 KB PRG-ROM bank, fixed to the last page
 * The CHR memory is usually RAM, mapped at PPU addresses $0000-$1FFF.
 */
export default class UxROM extends Mapper {
	static get id() {
		return 2;
	}

	/** Creates a memory segment for CPU range $4020-$FFFF. */
	createCPUSegment() {
		const unused = new MemoryPadding(0x3fe0);
		const prgRomSelectedPage = new MemoryChunk(_.first(this.prgPages));
		const prgRomLastPage = new MemoryChunk(_.last(this.prgPages));
		prgRomSelectedPage.readOnly = true;
		prgRomLastPage.readOnly = true;

		this._prgRomSwitchableBank = prgRomSelectedPage;

		return WithCompositeMemory.createSegment([
			//                      Address range   Size      Description
			unused, //              $4020-$7999     $3FE0     Unused space
			prgRomSelectedPage, //  $8000-$BFFF     $4000     PRG-ROM (switchable)
			prgRomLastPage //       $C000-$FFFF     $4000     PRG-ROM (fixed to last bank)
		]);
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment({ cartridge }) {
		const chrRom = new MemoryChunk(this.chrPages[0]);
		chrRom.readOnly = !cartridge.header.usesChrRam;

		return chrRom;
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		if (address >= 0x8000) {
			this._bankSwitch(byte);
			return;
		}

		this.context.cpu.memory.writeAt(address, byte);
	}

	_bankSwitch(byte) {
		const { header } = this.context.cartridge;

		const page = byte % header.prgRomPages;
		this._prgRomSwitchableBank.bytes = this.prgPages[page];
	}
}
