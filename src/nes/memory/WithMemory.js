import WithLittleEndian from "./WithLittleEndian";
import _ from "lodash";

/** A mixin for memory handling. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.defaults(obj, _.omit(this, "apply"));
		WithLittleEndian.apply(obj);
	},

	/** Returns the memory bytes. */
	getBytes() {
		throw new Error("not_implemented");
	},

	/** Reads a byte from `address`. */
	readAt(address) {
		try {
			return this.getBytes().readUInt8(address);
		} catch (e) {
			this._throwInvalidAddressError(address);
		}
	},

	/** Writes a `byte` to `address`. */
	writeAt(address, byte) {
		try {
			this.getBytes().writeUInt8(byte, address);
		} catch (e) {
			this._throwInvalidAddressError(address);
		}
	},

	_throwInvalidAddressError(address) {
		throw new Error(`Invalid memory access at 0x${address.toString(16)}`);
	}
};
