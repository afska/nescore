/**
 * "Accummulator" addressing mode.
 *
 * The parameter is the A register.
 */
export default {
	id: "ACCUMULATOR",
	parameterSize: 0,
	getAddress: ({ cpu }) => cpu.registers.a,
	getValue: () => {
		throw new Error(
			"The ACCUMULATOR addressing mode only supports the `getAddress` method"
		);
	}
};
