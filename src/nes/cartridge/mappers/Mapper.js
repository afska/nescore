import { MemoryChunk } from "../../memory";
import constants from "../../constants";
import { WithContext } from "../../helpers";
import _ from "lodash";

/**
 * An abstract class that represents a generic mapper.
 * It has two memory segments:
 * - One mapped at CPU $4020-$FFFF (for PRG ROM, PRG RAM, and mapper registers)
 * - One mapped at PPU $0000-$1FFF (for CHR ROM / Pattern tables)
 * It intercepts all CPU write operations.
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

	/** Creates a memory segment for CPU range $4020-$FFFF. */
	createCPUSegment(context) {
		throw new Error("not_implemented");
	}

	/** Creates a memory segment for PPU range $0000-$1FFF. */
	createPPUSegment(context) {
		throw new Error("not_implemented");
	}

	/** When a context is loaded. */
	onLoad(context) {
		const { cartridge } = context;

		const prg = cartridge.prgRom;
		const chr = cartridge.chrRom;

		const totalPrgPages = Math.floor(prg.length / this.prgRomPageSize);
		const totalChrPages = Math.floor(chr.length / this.chrRomPageSize);

		this.prgPages = _.range(0, totalPrgPages).map((page) =>
			this._getPage(prg, this.prgRomPageSize, page)
		);
		this.chrPages = _.range(0, totalChrPages).map((page) =>
			this._getPage(chr, this.chrRomPageSize, page)
		);

		this.segments = {
			cpu: this.createCPUSegment(context),
			ppu: this.createPPUSegment(context)
		};
	}

	/** Maps a CPU write operation. */
	cpuWriteAt(address, byte) {
		this.context.cpu.memory.writeAt(address, byte);
	}

	/** Runs at cycle 260 of every scanline (including preline). Returns a CPU interrupt or null. */
	tick() {
		return null;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			chrPages: this.context.cartridge.header.usesChrRam
				? this.chrPages.map((it) => Array.from(it))
				: null
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		if (saveState.chrPages != null)
			this.chrPages = saveState.chrPages.map((it) => new Uint8Array(it));
	}

	_newPrgBank(id = 0) {
		return new MemoryChunk(this.prgPages[id]).asReadOnly();
	}

	_newChrBank(cartridge, id = 0) {
		return new MemoryChunk(this.chrPages[id]).asReadOnly(
			!cartridge.header.usesChrRam
		);
	}

	_getPrgPage(page) {
		return this.prgPages[Math.max(0, page % this.prgPages.length)];
	}

	_getChrPage(page) {
		return this.chrPages[Math.max(0, page % this.chrPages.length)];
	}

	_getPage(memory, pageSize, page) {
		const offset = page * pageSize;
		return memory.slice(offset, offset + pageSize);
	}
}
