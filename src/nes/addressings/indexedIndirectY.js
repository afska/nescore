import indirect from "./indirect";
import getValue from "./_getValue";

/**
 * "Indirect indexed" addressing mode.
 *
 * The parameter is a single-byte memory address, which is dereferenced.
 * Then, the contents of Y is added to get the final address.
 */
export default {
	id: "INDEXED_INDIRECT_Y",
	parameterSize: 1,
	getAddress: (context, address) => {
		return (
			indirect.getAddress(context, address) + context.cpu.registers.y.value
		);
	},
	getValue
};
