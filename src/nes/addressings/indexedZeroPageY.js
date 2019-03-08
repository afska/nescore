import { Byte } from "../helpers";
import indexedGetAddress from "./_indexedGetAddress";
import getValue from "./_getValue";

const indexedGetAddressY = indexedGetAddress("y");

/**
 * "Zero page,Y" addressing mode.
 *
 * The parameter is a single-byte memory address.
 * The final address is that number plus the contents of Y.
 */
export default {
	id: "INDEXED_ZERO_PAGE_Y",
	parameterSize: 1,
	getAddress: (context, address) => {
		return Byte.force8Bit(indexedGetAddressY(context, address, false));
	},
	getValue
};
