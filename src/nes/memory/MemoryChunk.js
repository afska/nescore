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
		this.readOnly = false;
	}

	/** Reads a byte from `address`. */
	readAt(address) {
		this._assertValidAddress(address);

		return this.bytes[address];
	}

	/** Writes a `byte` to `address`. */
	writeAt(address, byte) {
		this._assertValidAddress(address);
		if (this.readOnly) return;

		this.bytes[address] = byte;
	}

	/** Sets the chunk's `readOnly` state. */
	asReadOnly(readOnly = true) {
		this.readOnly = readOnly;
		return this;
	}

	_assertValidAddress(address) {
		if (address < 0 || address > this.memorySize)
			this._throwInvalidAddressError(address);
	}

	_throwInvalidAddressError(address) {
		throw new Error(`Invalid memory access at 0x${address.toString(16)}.`);
	}
}
