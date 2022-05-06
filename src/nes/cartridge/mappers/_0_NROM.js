import Mapper from "./Mapper";
import { MemoryChunk, MemoryMirror, MemoryPadding } from "../../memory";

/**
 * The simplest mapper (also called "mapper 0").
 * It can have either one or two PRG ROM of 16KB, that are mapped
 * at ranges $8000-$BFFF and $C000-$FFFF of the CPU memory.
 * It also has CHR-ROM which contains the tile and sprite data.
 * This CHR-ROM is mapped to the PPU memory at addresses $0000-$1FFF.
 */
export default class NROM extends Mapper {
	static get id() {
		return 0;
	}

	/** When a context is loaded. */
	onLoad({ cartridge }) {
		const unused = new MemoryPadding(0x3fe0);
		const prgRomFirstPage = new MemoryChunk(this._getProgramBytes(0));
		const prgRomLastPage =
			cartridge.header.prgRomPages === 2
				? new MemoryChunk(this._getProgramBytes(1))
				: new MemoryMirror(prgRomFirstPage, 0x4000);

		this.defineChunks([
			//                   Address range   Size      Description
			unused, //           $4020-$7999     $3FE0     Unused space
			prgRomFirstPage, //  $8000-$BFFF     $4000     PRG-ROM (first 16KB of ROM)
			prgRomLastPage //    $C000-$FFFF     $4000     PRG-ROM (last 16KB of ROM or mirror)
		]);
		this._chrRom = new MemoryChunk(cartridge.chrRom);

		prgRomFirstPage.readOnly = true;
		prgRomLastPage.readOnly = true;
		this._chrRom.readOnly = !this.context.cartridge.usesChrRam;
	}

	/** Maps a PPU read operation. */
	ppuReadAt(address) {
		if (address >= 0x0000 && address < 0x2000)
			return this._chrRom.readAt(address);

		return this.context.ppu.memory.readAt(address);
	}

	/** Maps a PPU write operation. */
	ppuWriteAt(address, byte) {
		if (address >= 0x0000 && address < 0x2000)
			return this._chrRom.writeAt(address, byte);

		this.context.ppu.memory.writeAt(address, byte);
	}
}
