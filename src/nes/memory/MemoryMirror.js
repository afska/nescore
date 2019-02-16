import WithMemory from "./WithMemory";

/** A memory chunk that mirrors another `chunk`. */
export default class MemoryMirror {
	constructor(chunk, startAddress, size) {
		WithMemory.apply(this);

		this.chunk = chunk;
		this.memoryStartAddress = startAddress;
		this.memorySize = size;
	}

	/** Reads a byte from `address`, mirroring bytes. */
	readAt(address) {
		this._checkAddress(address);
		return this.chunk.readAt(address % this.chunk.memorySize);
	}

	/** Writes a `byte` to `address`, mirroring bytes. */
	writeAt(address, byte) {
		this._checkAddress(address);
		this.chunk.writeAt(address % this.chunk.memorySize, byte);
	}

	_checkAddress(address) {
		if (address >= this.memorySize)
			throw new Error(`Unreachable address: 0x${address.toString(16)}.`);
	}
}
