import WithLittleEndian from "./WithLittleEndian";
import { Buffer } from "buffer";
import _ from "lodash";

/**
 * A memory chunk that can store `bytes` (it can be a number or a Buffer).
 */
export default class MemoryChunk {
	constructor(bytes) {
		WithLittleEndian.apply(this);
		if (_.isFinite(bytes)) bytes = Buffer.alloc(bytes);

		this.bytes = bytes;
		this.memorySize = bytes.length;
	}

	/** Reads a byte from `address`. */
	readAt(address) {
		try {
			return this.bytes.readUInt8(address);
		} catch (e) {
			this._throwInvalidAddressError(address);
		}
	}

	/** Writes a `byte` to `address`. */
	writeAt(address, byte) {
		try {
			this.bytes.writeUInt8(byte, address);
		} catch (e) {
			this._throwInvalidAddressError(address);
		}
	}

	_throwInvalidAddressError(address) {
		throw new Error(`Invalid memory access at 0x${address.toString(16)}.`);
	}
}
