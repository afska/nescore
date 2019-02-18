import { signedByte } from "../helpers";

/**
 * "Relative" addressing mode.
 *
 * The parameter is a signed relative offset from the following instruction.
 */
export default {
	id: "RELATIVE",
	parameterSize: 1,
	getParameter: ({ cpu }, offset) => cpu.pc.value + signedByte.toNumber(offset)
};
