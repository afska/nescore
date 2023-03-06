/*
 * A byte helper. Signed bytes use the "Two's complement" representation.
 *
 * Positive values are: {value}             => [0  , 127]
 * Negative values are: -(256 - {value})   => [128, 255]
 */
export default {
	/** Converts a signed `byte` to a number (254 => -2). */
	toNumber(byte) {
		return (byte << 24) >> 24;
	},

	/** Converts a `number` to a signed byte (-2 => 254). */
	toSignedByte(number) {
		return number & 0xff;
	},

	/** Returns whether `value` can be represented as a single byte or not. */
	hasOverflow(value) {
		return value >= 256;
	},

	/** Returns whether `value` is positive or not. */
	isPositive(byte) {
		return !((byte >> 7) & 1);
	},

	/** Returns whether `value` is negative or not. */
	isNegative(byte) {
		return !!((byte >> 7) & 1);
	},

	/** Converts a signed `byte` to negative. */
	negate(byte) {
		return 256 - byte;
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
	getBits(byte, startPosition, size) {
		return (byte >> startPosition) & (0xff >> (8 - size));
	},

	/** Inserts a `value` of `size` bits inside a `byte`, starting at `startPosition`. */
	setBits(byte, startPosition, size, value) {
		let newByte = byte;
		for (let i = startPosition; i < startPosition + size; i++)
			newByte &= ~(1 << i);
		return newByte | (value << startPosition);
	},

	/** Returns the most significant byte of a `twoBytesNumber`. */
	highPartOf(twoBytesNumber) {
		return twoBytesNumber >> 8;
	},

	/** Returns the least significant byte of a `twoBytesNumber`. */
	lowPartOf(twoBytesNumber) {
		return twoBytesNumber & 0x00ff;
	},

	/** Returns a two bytes value from the `highByte` and `lowByte`. */
	to16Bit(highByte, lowByte) {
		return ((highByte & 0xff) << 8) | (lowByte & 0xff);
	}
};
