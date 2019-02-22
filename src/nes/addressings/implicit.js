const INVALID_OPERATION = () => {
	throw new Error("The parameter is implicit!");
};

/**
 * "Implicit" addressing mode.
 *
 * There's no extra parameter, it's implied by the instruction.
 */
export default {
	id: "IMPLICIT",
	parameterSize: 0,
	getAddress: INVALID_OPERATION,
	getValue: INVALID_OPERATION
};
