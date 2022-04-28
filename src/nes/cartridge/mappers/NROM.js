import Mapper from "./Mapper";
import {
	WithCompositeMemory,
	MemoryChunk,
	MemoryMirror,
	MemoryPadding
} from "../../memory";
import constants from "../../constants";

/** The simplest mapper (also called "mapper 0"). */
export default class NROM extends Mapper {
	static get id() {
		return 0;
	}

	constructor() {
		super();

		WithCompositeMemory.apply(this);
	}

	/** When a context is loaded. */
	onLoad({ cartridge }) {
		const unused = new MemoryPadding(0x3fe0);
		const prgRomFirstPage = new MemoryChunk(
			cartridge.prgRom.slice(0, constants.PRG_ROM_PAGE_SIZE)
		);
		const prgRomLastPage =
			cartridge.header.prgRomPages === 2
				? new MemoryChunk(
						cartridge.prgRom.slice(
							constants.PRG_ROM_PAGE_SIZE,
							constants.PRG_ROM_PAGE_SIZE * 2
						)
				  )
				: new MemoryMirror(prgRomFirstPage, 0x4000);

		this.defineChunks([
			//                   Address   Size      Description
			unused, //           $4020     $3FE0     Unused space
			prgRomFirstPage, //  $8000     $4000     PRG-ROM (first 16KB of ROM)
			prgRomLastPage //    $C000     $4000     PRG-ROM (last 16KB of ROM or mirror)
		]);

		this._chrRom = new MemoryChunk(cartridge.chrRom);
	}

	/** Maps a PPU read operation. */
	ppuReadAt(address) {
		return address >= 0x0000 && address <= 0x1fff
			? this._chrRom.readAt(address)
			: this.context.ppu.memory.readAt(address);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.defineChunks(null);
	}
}
