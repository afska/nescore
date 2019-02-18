/**
 * "Immediate" addressing mode.
 *
 * The parameter is the actual value to use.
 */
export default {
	id: "IMMEDIATE",
	parameterSize: 1,
	getParameter: (context, value) => value
};
