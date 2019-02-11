/**
 * "Relative" addressing mode.
 *
 * The parameter is a relative offset from the following instruction.
 * Values <= 127 are positive, and the ones between [128, 255] are negative.
 *
 * Positive values are: {value}
 * Negative values are: -(256 - {value})
 */
export default {
  name: "relative",
  size: 1
};
