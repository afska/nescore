import _ from "lodash";

const NOT_IMPLEMENTED = () => {
	throw new Error("not_implemented");
};

/** A mixin for memory handling. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.defaults(obj, _.omit(this, "apply"));
	},

	/** Returns the starting memory address. */
	getMemoryStartAddress: NOT_IMPLEMENTED,

	/** Returns the memory bytes. */
	getMemory: NOT_IMPLEMENTED,

	/** Reads a byte from `address`. */
	readAt(address) {
		const offset = address - this.getMemoryStartAddress();
		return this.getMemory(address).readUInt8(offset);
	},

	/** Writes a `byte` to `address`. */
	writeAt(address, byte) {
		const offset = address - this.getMemoryStartAddress();
		this.getMemory(address, offset).writeUInt8(byte, offset);
	}
};
