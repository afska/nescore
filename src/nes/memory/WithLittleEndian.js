import { Byte } from "../helpers";
import _ from "lodash";

/** A mixin for reading bytes in Little Endian. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.defaults(obj, _.omit(this, "apply"));
	},

	/** Reads `length` (1 or 2) bytes in LE from `address`. */
	readBytesAt(address, length) {
		return length === 2 ? this.read2BytesAt(address) : this.readAt(address);
	},

	/** Writes two bytes in LE to `address`. */
	write2BytesAt(address, value) {
		const low = Byte.lowPartOf(value);
		const high = Byte.highPartOf(value);

		this.writeAt(address, low);
		this.writeAt(address + 1, high);
	},

	/** Reads two bytes in LE from `address`. */
	read2BytesAt(address) {
		const low = this.readAt(address);
		const high = this.readAt(address + 1);

		return Byte.to16Bit(high, low);
	}
};
