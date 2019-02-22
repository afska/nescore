/**
 * "Immediate" addressing mode.
 *
 * The parameter is the actual value to use.
 */
export default {
	id: "IMMEDIATE",
	parameterSize: 1,
	getAddress: () => {
		throw new Error(
			"The IMMEDIATE addressing mode only supports the `getValue` method"
		);
	},
	getValue: (context, value) => value
};
