import _ from "lodash";

const NOT_IMPLEMENTED = () => throw new Error("not_implemented");

/** A mixin for memory handling. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.assign(obj, _.omit(this, "apply"));
	},

	/** Returns the starting memory address. */
	getMemoryStartAddress: NOT_IMPLEMENTED,

	/** Returns the memory bytes. */
	getMemory: NOT_IMPLEMENTED,

	/** Reads a byte from `address`. */
	readMemory(address) {
		const offset = address - this.getMemoryStartAddress();
		return this.getMemory(address).readUInt8(offset, size);
	},

	/** Ẁrites a `byte` to `address`. */
	writeMemory(address, byte) {
		const offset = address - this.getMemoryStartAddress();
		this.getMemory(address).writeUInt8(byte, offset);
	}
};
