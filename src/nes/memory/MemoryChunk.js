import WithMemory from "./WithMemory";

/** A memory chunk that can store `bytes`. */
export default class MemoryChunk {
	constructor(bytes, startAddress = 0x0000) {
		WithMemory.apply(this);

		this.bytes = bytes;
		this.startAddress = startAddress;
		this.size = bytes.length;
	}

	getMemory() {
		return this.bytes;
	}
}
