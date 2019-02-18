const instructions = () => [
	/**
	 * Logical AND
	 *
	 * Performs a logical AND between A and `value`, storing the
	 * result in A and setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "AND",
		execute: ({ cpu }, value) => {
			const result = cpu.registers.a.value & value;
			cpu.registers.a.value = result;
			cpu.flags.updateZeroAndNegative(result);
		}
	}
];

export default instructions();
