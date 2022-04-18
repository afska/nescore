import WithLittleEndian from "./WithLittleEndian";

/**
 * A memory chunk that doesn't use space.
 * It's usually mapped / rewired to another thing.
 */
export default class MemoryPadding {
	constructor(size) {
		WithLittleEndian.apply(this);

		this.memorySize = size;
	}

	/** Reads nothing. */
	readAt(address) {
		return 0;
	}

	/** Writes nothing. */
	writeAt(address, byte) {}
}
