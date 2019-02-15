import MemoryOwner from "./MemoryOwner";

export default class Memory {
	constructor(bytes, startAt, endAt) {
		MemoryOwner.apply(this);

		this.bytes = bytes;
		this.startAt = startAt;
		this.endAt = endAt;
	}

	getMemoryStartAddress() {
		return this.startAt;
	}

	getMemoryEndAddress() {
		return this.endAt;
	}

	getMemory() {
		return this.bytes;
	}
}
