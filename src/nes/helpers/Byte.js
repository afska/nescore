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

	/** Returns if `value` can be represented as a single byte. */
	hasOverflow(value) {
		return value >= SIZE;
	},

	/** Returns if `value` is positive. */
	isPositive(byte) {
		return !this.isNegative(byte);
	},

	/** Returns if `value` is negative. */
	isNegative(byte) {
		return !!(byte & 0b10000000);
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

	/** Returns a sub-number from the `startPosition` to the `endPosition` of a `byte`. */
	getSubNumber(byte, startPosition, endPosition) {
		const bits = endPosition - startPosition + 1;
		return (byte >> startPosition) & (0xff >> (8 - bits));
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
