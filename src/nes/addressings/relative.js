import { Byte } from "../helpers";
import getValue from "./_getValue";

/**
 * "Relative" addressing mode.
 *
 * The parameter is a signed relative offset from the following instruction.
 */
export default {
	id: "RELATIVE",
	parameterSize: 1,
	getAddress: ({ cpu }, offset) => cpu.pc.value + Byte.toNumber(offset),
	getValue
};
