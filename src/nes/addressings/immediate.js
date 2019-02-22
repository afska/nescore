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
			"An instruction with IMMEDIATE addressing mode should have `needsValue: true`."
		);
	},
	getValue: (context, value) => value
};
