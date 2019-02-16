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
		return this.getMemory().readUInt8(address);
	},

	/** Writes a `byte` to `address`. */
	writeAt(address, byte) {
		this.getMemory().writeUInt8(byte, address);
	}
};
