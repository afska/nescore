import constants from "../../constants";
import { WithContext } from "../../helpers";
import _ from "lodash";

/**
 * An abstract class that represents a generic mapper.
 * It intercepts all CPU/PPU memory read/write operations.
 */
export default class Mapper {
	static get id() {
		throw new Error("not_implemented");
	}

	constructor() {
		WithContext.apply(this);
	}

	/** When a context is loaded. */
	onLoad(context) {
		const { cartridge } = context;

		const prg = cartridge.prgRom;
		const chr = cartridge.chrRom;

		this.prgPages = _.range(0, cartridge.header.prgRomPages).map((page) =>
			this._getPage(prg, constants.PRG_ROM_PAGE_SIZE, page)
		);
		this.chrPages = _.range(0, cartridge.header.chrRomPages).map((page) =>
			this._getPage(chr, constants.CHR_ROM_PAGE_SIZE, page)
		);

		this.segments = {
			cpu: this.createCPUSegment(context),
			ppu: this.createPPUSegment(context)
		};
	}

	/** Maps a CPU read operation. */
	cpuReadAt(address) {
		return this.context.cpu.memory.readAt(address);
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		this.context.cpu.memory.writeAt(address, byte);
	}

	/** Maps a PPU read operation. */
	ppuReadAt(address) {
		return this.context.ppu.memory.readAt(address);
	}

	/** Maps a PPU write operation. */
	ppuWriteAt(address, byte) {
		this.context.ppu.memory.writeAt(address, byte);
	}

	_getPage(memory, pageSize, page) {
		const offset = page * pageSize;
		return memory.slice(offset, offset + pageSize);
	}
}
