import indexedGetAddress from "./_indexedGetAddress";
import getValue from "./_getValue";

/**
 * "Absolute,Y" addressing mode.
 *
 * The parameter is an absolute memory address.
 * The final address is that number plus the contents of Y.
 */
export default {
	id: "INDEXED_ABSOLUTE_Y",
	parameterSize: 2,
	getAddress: indexedGetAddress("y"),
	getValue
};
