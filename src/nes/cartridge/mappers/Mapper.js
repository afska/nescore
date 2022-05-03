import { WithContext } from "../../helpers";

/**
 * An abstract class that represents a generic mapper.
 * It intercepts all CPU/PPU memory read/write operations.
 * */
export default class Mapper {
	static get id() {
		throw new Error("not_implemented");
	}

	constructor() {
		WithContext.apply(this);
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
}
