import WithMemory from "./WithMemory";

/** A memory chunk that can store `bytes`. */
export default class MemoryChunk {
	constructor(bytes, startAt) {
		WithMemory.apply(this);

		this.bytes = bytes;
		this.startAt = startAt;
	}

	getMemoryStartAddress() {
		return this.startAt;
	}

	getMemory() {
		return this.bytes;
	}
}
