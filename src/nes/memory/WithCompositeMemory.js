import WithLittleEndian from "./WithLittleEndian";
import _ from "lodash";

/** A mixin for composite memory handling, with multiple `chunks`. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.defaults(obj, _.omit(this, "apply", "createSegment"));
		WithLittleEndian.apply(obj);
		obj.chunks = null;
		obj.lut = null;
	},

	/** Creates a composite memory segment with different `chunks`. */
	createSegment(chunks) {
		const memory = {};
		this.apply(memory);
		memory.defineChunks(chunks);
		return memory;
	},

	/** Defines the `chunks` of the memory map. */
	defineChunks(chunks) {
		this.chunks = chunks;
		this.lut = {};

		let startAddress = 0;
		for (let chunk of this.chunks) {
			chunk.$memoryStartAddress = startAddress;
			startAddress += chunk.memorySize;
		}

		this.memorySize = startAddress;

		this._generateLookUpTable(startAddress);
	},

	/** Reads a byte from `address`, using the correct `chunk`. */
	readAt(address) {
		const chunk = this.lut[address] || this._throwUnreachable(address);
		const offset = this._toRelativeAddress(address, chunk);
		return chunk.readAt(offset);
	},

	/** Writes a `byte` to `address`, using the correct `chunk`. */
	writeAt(address, byte) {
		const chunk = this.lut[address] || this._throwUnreachable(address);
		const offset = this._toRelativeAddress(address, chunk);
		return chunk.writeAt(offset, byte);
	},

	_throwUnreachable(address) {
		throw new Error(`Unreachable address: 0x${address.toString(16)}.`);
	},

	_generateLookUpTable(finalAddress) {
		for (let i = 0; i < finalAddress; i++) this.lut[i] = this._getChunkFor(i);
	},

	_getChunkFor(address) {
		for (let chunk of this.chunks) {
			const startAddress = chunk.$memoryStartAddress;

			if (address >= startAddress && address < startAddress + chunk.memorySize)
				return chunk;
		}
	},

	_toRelativeAddress(address, chunk) {
		return address - chunk.$memoryStartAddress;
	}
};
