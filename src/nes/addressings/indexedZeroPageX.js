import { Byte } from "../helpers";
import indexedGetAddress from "./_indexedGetAddress";
import getValue from "./_getValue";

const indexedGetAddressX = indexedGetAddress("x");

/**
 * "Zero page,X" addressing mode.
 *
 * The parameter is a single-byte memory address.
 * The final address is that number plus the contents of X.
 */
export default {
	id: "INDEXED_ZERO_PAGE_X",
	parameterSize: 1,
	getAddress: (context, address) => {
		return Byte.force8Bit(indexedGetAddressX(context, address, false));
	},
	getValue
};
