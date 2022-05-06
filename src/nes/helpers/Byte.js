const SIZE = 256;
const LIMIT = SIZE / 2 - 1;

/*
 * A byte helper. Signed bytes use the "Two's complement" representation.
 *
 * Positive values are: {value}             => [0  , 127]
 * Negative values are: -(SIZE - {value})   => [128, 255]
 */
export default {
	/** Converts a signed `byte` to a number. */
	toNumber(byte) {
		return byte <= LIMIT ? byte : -(SIZE - byte);
	},

	/** Converts a `number` to a signed byte. */
	toSignedByte(number) {
		return number < 0 ? number + SIZE : number;
	},

	/** Returns whether `value` can be represented as a single byte or not. */
	hasOverflow(value) {
		return value >= SIZE;
	},

	/** Returns whether `value` is positive or not. */
	isPositive(byte) {
		return !this.isNegative(byte);
	},

	/** Returns whether `value` is negative or not. */
	isNegative(byte) {
		return !!this.getBit(byte, 7);
	},

	/** Converts a signed `byte` to negative. */
	negate(byte) {
		return SIZE - byte;
	},

	/** Forces a `value` to fit in 8 bits (256 => 0). */
	force8Bit(value) {
		return value & 0xff;
	},

	/** Forces a `value` to fit in 16 bits (65536 => 0). */
	force16Bit(value) {
		return value & 0xffff;
	},

	/** Returns the bit located at `position` in `number`. */
	getBit(number, position) {
		return (number >> position) & 1;
	},

	/** Returns a sub-number of `size` bits inside a `byte`, starting at `startPosition`. */
	getSubNumber(byte, startPosition, size) {
		return (byte >> startPosition) & (0xff >> (8 - size));
	},

	/** Inserts a `value` of `size` bits inside a `byte`, starting at `startPosition`. */
	setSubNumber(byte, startPosition, size, value) {
		let newByte = byte;
		for (let i = startPosition; i < startPosition + size; i++)
			newByte &= this.negate(1 << i) - 1;
		return newByte | (value << startPosition);
	},

	/** Returns the most significative byte of a `twoBytesNumber`. */
	highPartOf(twoBytesNumber) {
		return twoBytesNumber >> 8;
	},

	/** Returns the least significative byte of a `twoBytesNumber`. */
	lowPartOf(twoBytesNumber) {
		return twoBytesNumber & 0x00ff;
	},

	/** Returns a two bytes value from the `mostSignificativeByte` and `leastSignificativeByte`. */
	to16Bit(mostSignificativeByte, leastSignificativeByte) {
		return (
			(this.force8Bit(mostSignificativeByte) << 8) |
			this.force8Bit(leastSignificativeByte)
		);
	}
};
