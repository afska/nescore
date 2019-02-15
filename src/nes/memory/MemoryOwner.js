import _ from "lodash";

const NOT_IMPLEMENTED = () => throw new Error("not_implemented");

export default {
	apply(obj) {
		_.assign(obj, this);
	},
	getMemoryStartAddress: NOT_IMPLEMENTED,
	getMemoryEndAddress: NOT_IMPLEMENTED,
	getMemory: NOT_IMPLEMENTED,
	readMemoryaddress() {
		const offset = address - this.getMemoryStartAddress();
		return this.getMemory().readUInt8(offset, size);
	},
	writeMemory(address, byte) {
		const offset = address - this.getMemoryStartAddress();
		this.getMemory().writeUInt8(byte, offset);
	}
};
