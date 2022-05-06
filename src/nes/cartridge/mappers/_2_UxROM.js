import Mapper from "./Mapper";
import { MemoryChunk, MemoryPadding } from "../../memory";
import _ from "lodash";

/**
 * It provide bank-switching capabilities, just by writing a byte to any address on PRG-ROM space.
 * CPU $8000-$BFFF: 16 KB switchable PRG-ROM bank
 * CPU $C000-$FFFF: 16 KB PRG ROM bank, fixed to the last bank
 * The CHR memory is usually RAM, mapped at PPU addresses $0000-$1FFF.
 */
export default class UxROM extends Mapper {
	static get id() {
		return 2;
	}

	/** When a context is loaded. */
	onLoad({ cartridge }) {
		this.banks = _.range(0, cartridge.header.prgRomPages - 1).map((page) =>
			this._getProgramBytes(page)
		);

		const unused = new MemoryPadding(0x3fe0);
		const prgRomSelectedPage = new MemoryChunk(this.banks[0]);
		const prgRomLastPage = new MemoryChunk(
			this._getProgramBytes(cartridge.header.prgRomPages - 1)
		);

		this.defineChunks([
			//                      Address range   Size      Description
			unused, //              $4020-$7999     $3FE0     Unused space
			prgRomSelectedPage, //  $8000-$BFFF     $4000     PRG-ROM (16 KB switchable PRG-ROM bank)
			prgRomLastPage //       $C000-$FFFF     $4000     PRG-ROM (last 16 KB PRG ROM bank)
		]);
		this._chrRom = new MemoryChunk(cartridge.chrRom);
		this._prgRomSelectedPage = prgRomSelectedPage;

		prgRomSelectedPage.readOnly = true;
		prgRomLastPage.readOnly = true;
		this._chrRom.readOnly = !this.context.cartridge.usesChrRam;
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		const { header } = this.context.cartridge;

		if (address >= 0x8000) {
			const page = byte % header.prgRomPages;
			this._prgRomSelectedPage.bytes = this.banks[page];
			return;
		}

		this.context.cpu.memory.writeAt(address, byte);
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
