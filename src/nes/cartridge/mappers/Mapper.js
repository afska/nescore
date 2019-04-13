import { WithComposedMemory } from "../../memory";

/** An abstract class that represents a generic mapper. */
export default class Mapper {
	static get id() {
		throw new Error("not_implemented");
	}

	/** Runs in the last PPU cycle. Some mappers use it. */
	step() {}

	/** Maps a PPU read operation. */
	mapPpuReadAt(memory, address) {
		return WithComposedMemory.readAt.call(memory, address);
	}

	/** Maps a PPU write operation. */
	mapPpuWriteAt(memory, address, byte) {
		WithComposedMemory.writeAt.call(memory, address, byte);
	}
}
