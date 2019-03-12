import WithLittleEndian from "./WithLittleEndian";

/** A memory chunk that mirrors another `chunk`. */
export default class MemoryMirror {
	constructor(
		chunk,
		size,
		startAt = 0,
		mirroredSize = chunk.memorySize - startAt
	) {
		WithLittleEndian.apply(this);

		this.chunk = chunk;
		this.startAt = startAt;
		this.mirroredSize = mirroredSize;
		this.memorySize = size;
	}

	/** Reads a byte from `address`, mirroring bytes. */
	readAt(address) {
		this._checkAddress(address);
		return this.chunk.readAt(this.startAt + (address % this.mirroredSize));
	}

	/** Writes a `byte` to `address`, mirroring bytes. */
	writeAt(address, byte) {
		this._checkAddress(address);
		this.chunk.writeAt(this.startAt + (address % this.mirroredSize), byte);
	}

	_checkAddress(address) {
		if (address >= this.memorySize)
			throw new Error(`Unreachable address: 0x${address.toString(16)}.`);
	}
}
