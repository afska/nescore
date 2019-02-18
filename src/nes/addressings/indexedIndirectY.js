import { Byte } from "../helpers";
import indirect from "./indirect";

/**
 * "Indirect indexed" addressing mode.
 *
 * The parameter is a single-byte memory address, which is dereferenced.
 * Then, the contents of Y is added to the final address.
 */
export default {
	id: "INDEXED_INDIRECT_Y",
	parameterSize: 1,
	getParameter: (context, address) => {
		return (
			indirect.getParameter(context, address) + context.cpu.registers.y.value
		);
	}
};
