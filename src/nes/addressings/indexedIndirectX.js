import { Byte } from "../helpers";
import { getIndirectAddress } from "./indirect";
import getValue from "./_getValue";

/**
 * "Indexed indirect" addressing mode.
 *
 * The parameter is a single-byte memory address, but the contents of X is
 * added to that address, and the result is used to look up a two-byte address.
 */
export default {
	id: "INDEXED_INDIRECT_X",
	parameterSize: 1,
	getAddress: (context, address) => {
		return getIndirectAddress(
			context,
			address + context.cpu.registers.x.value,
			Byte.to8Bit
		);
	},
	getValue
};
