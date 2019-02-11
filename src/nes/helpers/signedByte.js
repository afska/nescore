const SIZE = 256;
const LIMIT = SIZE / 2 - 1;

/*
 * A signed byte helper in the "Two's complement" representation.
 *
 * Positive values are: {value}
 * Negative values are: -(SIZE - {value})
 */
export default {
  toNumber(byte) {
    return byte < LIMIT ? byte : -(SIZE - byte);
  },

  toByte(number) {
    return number < 0 ? number + SIZE : number;
  }
};
