import Mapper from "./Mapper";
import {
	MemoryChunk,
	MemoryMirror,
	MemoryPadding,
	WithCompositeMemory
} from "../../memory";

/**
 * The simplest mapper (also called "mapper 0").
 * It can have either one or two PRG ROM of 16KB, that are mapped
 * at ranges $8000-$BFFF and $C000-$FFFF of the CPU memory.
 * It also has CHR ROM which contains the tile and sprite data.
 * This CHR ROM is mapped to the PPU memory at addresses $0000-$1FFF.
 */
export default class NROM extends Mapper {
	static get id() {
		return 0;
	}

	/** Creates a memory segment for CPU range $4020-$FFFF. */
	createCPUSegment({ cartridge }) {
		const unused = new MemoryPadding(0x3fe0);
		const prgRomFirstPage = new MemoryChunk(this.prgPages[0]);
		const prgRomLastPage =
			cartridge.header.prgRomPages === 2
				? new MemoryChunk(this.prgPages[1])
				: new MemoryMirror(prgRomFirstPage, 0x4000);
		prgRomFirstPage.readOnly = true;
		prgRomLastPage.readOnly = true;

		return WithCompositeMemory.createSegment([
			//                   Address range   Size      Description
			unused, //           $4020-$7999     $3FE0     Unused space
			prgRomFirstPage, //  $8000-$BFFF     $4000     PRG ROM (first 16KB of ROM)
			prgRomLastPage //    $C000-$FFFF     $4000     PRG ROM (last 16KB of ROM or mirror)
		]);
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment({ cartridge }) {
		const chrRom = new MemoryChunk(this.chrPages[0]);
		chrRom.readOnly = !cartridge.header.usesChrRam;

		return chrRom;
	}
}
