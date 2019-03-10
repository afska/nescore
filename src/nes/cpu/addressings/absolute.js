import getValue from "./_getValue";

/**
 * "Absolute" addressing mode.
 *
 * The parameter is an absolute memory address.
 */
export default {
	id: "ABSOLUTE",
	parameterSize: 2,
	getAddress: (context, address) => address,
	getValue
};
