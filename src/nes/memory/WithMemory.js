import _ from "lodash";

/** A mixin for memory handling. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.defaults(obj, _.omit(this, "apply"));
	},

	/** Returns the memory bytes. */
	getMemory() {
		throw new Error("not_implemented");
	},

	/** Reads a byte from `address`. */
	readAt(address) {
		try {
			return this.getMemory().readUInt8(address);
		} catch (e) {
			this._throwInvalidAddressError(address);
		}
	},

	/** Writes a `byte` to `address`. */
	writeAt(address, byte) {
		try {
			this.getMemory().writeUInt8(byte, address);
		} catch (e) {
			this._throwInvalidAddressError(address);
		}
	},

	_throwInvalidAddressError(address) {
		throw new Error(`Invalid memory access at 0x${address.toString(16)}`);
	}
};
