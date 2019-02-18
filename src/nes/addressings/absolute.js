/**
 * "Absolute" addressing mode.
 *
 * The parameter is an absolute memory address.
 */
export default {
	id: "ABSOLUTE",
	parameterSize: 2,
	getParameter: (context, address) => address
};
