import constants from "../../constants";
import { WithContext } from "../../helpers";
import _ from "lodash";

/**
 * An abstract class that represents a generic mapper.
 * It has two memory segments:
 * - One mapped at CPU $4020-$FFFF (for PRG ROM, PRG RAM, and mapper registers)
 * - One mapped at PPU $0000-$1FFF (for CHR ROM / Pattern tables)
 * It intercepts all CPU/PPU memory read/write operations.
 */
export default class Mapper {
	static get id() {
		throw new Error("not_implemented");
	}

	constructor(
		prgRomPageSize = constants.PRG_ROM_PAGE_SIZE,
		chrRomPageSize = constants.CHR_ROM_PAGE_SIZE
	) {
		WithContext.apply(this);

		this.prgRomPageSize = prgRomPageSize;
		this.chrRomPageSize = chrRomPageSize;
	}

	/** When a context is loaded. */
	onLoad(context) {
		const { cartridge } = context;

		const prg = cartridge.prgRom;
		const chr = cartridge.chrRom;
		const prgPages = Math.floor(prg.length / this.prgRomPageSize);
		const chrPages = Math.floor(chr.length / this.chrRomPageSize);

		this.prgPages = _.range(0, prgPages).map((page) =>
			this._getPage(prg, this.prgRomPageSize, page)
		);
		this.chrPages = _.range(0, chrPages).map((page) =>
			this._getPage(chr, this.chrRomPageSize, page)
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

	_getPrgPage(page) {
		return this.prgPages[page % this.prgPages.length];
	}

	_getChrPage(page) {
		return this.chrPages[page % this.chrPages.length];
	}

	_getPage(memory, pageSize, page) {
		const offset = page * pageSize;
		return memory.slice(offset, offset + pageSize);
	}
}
