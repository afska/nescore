import WithMemory from "./WithMemory";

/** A memory chunk that can store `bytes`. */
export default class MemoryChunk {
	constructor(bytes, startAddress = 0x0000) {
		WithMemory.apply(this);

		this.bytes = bytes;
		this.memoryStartAddress = startAddress;
		this.memorySize = bytes.length;
	}

	/** Returns the memory bytes. */
	getMemory() {
		return this.bytes;
	}
}
