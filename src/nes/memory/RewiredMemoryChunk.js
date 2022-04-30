import { MemoryChunk } from "../memory";

/**
 * A memory segment that accepts a `mapping` object which translates internal addresses.
 * For example, in PPU's Palette RAM, $10/$14/$18/$1C are mirrors of $00/$04/$08/$0C, so:
 * mapping = { 0x10: 0x00, 0x14: 0x04, 0x18: 0x08, 0x1c: 0x0c }
 */
export default class RewiredMemoryChunk extends MemoryChunk {
	constructor(bytes, mapping) {
		super(bytes);

		this.mapping = mapping;
	}

	/**
	 * Creates a mapping object from a `ranges` array.
	 * For example:
	 * The list [{ from: 10, size: 5, to: 1 }]...
	 * ...creates the mapping { 10: 1, 11: 2, 12: 3, 13: 4, 14: 5 }
	 */
	static createMapping(ranges) {
		const mapping = {};
		for (let range of ranges) {
			for (let i = 0; i < range.size; i++) {
				mapping[range.from + i] = range.to + i;
			}
		}
		return mapping;
	}

	/** Reads a byte from `address`, following mirroring rules. */
	readAt(address) {
		const mappedAddress = this.mapping[address];
		address = mappedAddress != null ? mappedAddress : address;

		return super.readAt(address);
	}

	/** Writes a `byte` to `address`, following mirroring rules. */
	writeAt(address, byte) {
		const mappedAddress = this.mapping[address];
		address = mappedAddress != null ? mappedAddress : address;

		super.writeAt(address, byte);
	}
}
