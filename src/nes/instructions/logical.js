const instructions = () => [
	/**
	 * Logical AND
	 *
	 * Performs a "bit by bit" logical AND between A and `value`, storing
	 * the result in A and setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "AND",
		needsValue: true,
		execute: LOGICAL_INSTRUCTION((one, another) => one & another)
	},

	/**
	 * Exclusive OR
	 *
	 * Performs a "bit by bit" exclusive OR between A and `value`, storing
	 * the result in A and setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "EOR",
		needsValue: true,
		execute: LOGICAL_INSTRUCTION((one, another) => one ^ another)
	},

	/**
	 * Logical Inclusive OR
	 *
	 * Performs a "bit by bit" logical inclusive OR between A and `value`, storing
	 * the result in A and setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "ORA",
		needsValue: true,
		execute: LOGICAL_INSTRUCTION((one, another) => one | another)
	}
];

const LOGICAL_INSTRUCTION = (operator) => {
	return ({ cpu }, value) => {
		const result = operator(cpu.registers.a.value, value);
		cpu.registers.a.value = result;
		cpu.flags.updateZeroAndNegative(result);
	};
};

export default instructions();
