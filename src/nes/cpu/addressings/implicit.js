/**
 * "Implicit" addressing mode.
 *
 * There's no extra parameter, it's implied by the instruction.
 */
export default {
	id: "IMPLICIT",
	parameterSize: 0,
	getAddress: (context) => null,
	getValue: () => {
		throw new Error(
			"The IMPLICIT addressing mode only supports the `getAddress` method (and it always returns null)"
		);
	}
};
