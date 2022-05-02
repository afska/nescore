import WithLittleEndian from "./WithLittleEndian";
import _ from "lodash";

/**
 * A memory chunk that can store `bytes` (it can be a number or a Buffer).
 */
export default class MemoryChunk {
	constructor(bytes) {
		WithLittleEndian.apply(this);
		if (_.isFinite(bytes)) bytes = new Uint8Array(bytes);

		this.bytes = bytes;
		this.memorySize = bytes.length;
	}

	/** Reads a byte from `address`. */
	readAt(address) {
		if (address < 0 || address > this.memorySize)
			this._throwInvalidAddressError(address);

		return this.bytes[address];
	}

	/** Writes a `byte` to `address`. */
	writeAt(address, byte) {
		if (address < 0 || address > this.memorySize)
			this._throwInvalidAddressError(address);

		this.bytes[address] = byte;
	}

	_throwInvalidAddressError(address) {
		throw new Error(`Invalid memory access at 0x${address.toString(16)}.`);
	}
}
