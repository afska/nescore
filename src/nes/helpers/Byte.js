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
		return byte < LIMIT ? byte : -(SIZE - byte);
	},

	toSignedByte(number) {
		return number < 0 ? number + SIZE : number;
	},

	isNegative(byte) {
		return byte & 0b10000000;
	},

	to16BitNumber(mostSignificativeByte, leastSignificativeByte) {
		return (
			((mostSignificativeByte & 0xff) << 8) | (leastSignificativeByte & 0xff)
		);
	}
};
