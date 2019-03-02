const SIZE = 256;
const LIMIT = SIZE / 2 - 1;

/*
 * A byte helper. Signed bytes use the "Two's complement" representation.
 *
 * Positive values are: {value}
 * Negative values are: -(SIZE - {value})
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

	to8Bit(value) {
		return value & 0xff;
	},

	to16Bit(mostSignificativeByte, leastSignificativeByte) {
		return (
			(this.to8Bit(mostSignificativeByte) << 8) |
			this.to8Bit(leastSignificativeByte)
		);
	}
};
