import { WithComposedMemory, MemoryChunk, MemoryMirror } from "../../memory";

const KB = 1024;
const PRG_ROM_PAGE_SIZE = 16 * KB;
const MEMORY_SIZE = 0xbfe0;

/** The simplest mapper (also called "mapper 0"). */
export default class NROM {
	static get id() {
		return 0;
	}

	constructor(cartridge) {
		WithComposedMemory.apply(this);

		const unused = new MemoryChunk(0x3fe0);
		const prgRomFirstPage = new MemoryChunk(
			cartridge.prgRom.slice(0, PRG_ROM_PAGE_SIZE)
		);
		const prgRomLastPage =
			cartridge.header.prgRomPages === 2
				? new MemoryChunk(
						cartridge.prgRom.slice(PRG_ROM_PAGE_SIZE, PRG_ROM_PAGE_SIZE * 2)
				  )
				: new MemoryMirror(prgRomFirstPage, 0x4000);

		this.defineChunks([
			//                   Address   Size      Description
			unused, //           $4020     $3FE0     Unused space
			prgRomFirstPage, //  $8000     $4000     PRG-ROM (first 16KB of ROM)
			prgRomLastPage //    $C000     $4000     PRG-ROM (last 16KB of ROM or mirror)
		]);
	}

	/** Returns the assigned size in the memory map. */
	get memorySize() {
		return MEMORY_SIZE;
	}
}
