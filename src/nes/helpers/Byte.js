const SIZE = 256;
const LIMIT = SIZE / 2 - 1;

/*
 * A byte helper. Signed bytes use the "Two's complement" representation.
 *
 * Positive values are: {value}             => [0  , 127]
 * Negative values are: -(SIZE - {value})   => [128, 255]
 */
export default {
	toNumber(byte) {
		return byte <= LIMIT ? byte : -(SIZE - byte);
	},

	toSignedByte(number) {
		return number < 0 ? number + SIZE : number;
	},

	hasOverflow(value) {
		return value >= SIZE;
	},

	isPositive(byte) {
		return !this.isNegative(byte);
	},

	isNegative(byte) {
		return !!(byte & 0b10000000);
	},

	negate(byte) {
		return SIZE - byte;
	},

	to8Bit(value) {
		return value & 0xff;
	},

	highPartOf(twoBytesNumber) {
		return twoBytesNumber >> 8;
	},

	lowPartOf(twoBytesNumber) {
		return twoBytesNumber & 0x00ff;
	},

	to16Bit(mostSignificativeByte, leastSignificativeByte) {
		return (
			(this.to8Bit(mostSignificativeByte) << 8) |
			this.to8Bit(leastSignificativeByte)
		);
	}
};
