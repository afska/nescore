const instructions = () => [
	/**
	 * Clear Carry Flag
	 *
	 * Clears the C (carry) flag.
	 */
	{
		id: "CLC",
		execute: CL_("c")
	},

	/**
	 * Clear Decimal Mode
	 *
	 * Clears the D (decimal mode) flag.
	 */
	{
		id: "CLD",
		execute: CL_("d")
	},

	/**
	 * Clear Interrupt Disable
	 *
	 * Clears the I (interrupt disable) flag.
	 */
	{
		id: "CLI",
		execute: CL_("i")
	},

	/**
	 * Clear Overflow Flag
	 *
	 * Clears the V (overflow) flag.
	 */
	{
		id: "CLV",
		execute: CL_("v")
	},

	/**
	 * Load Accumulator
	 *
	 * Loads `value` into A, setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "LDA",
		execute: LD_("a")
	},

	/**
	 * Load X Register
	 *
	 * Loads `value` into X, setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "LDX",
		execute: LD_("x")
	},

	/**
	 * Load Y Register
	 *
	 * Loads `value` into Y, setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "LDY",
		execute: LD_("y")
	}
];

const CL_ = (flag) => {
	return (cpu) => {
		cpu.flags[flag] = false;
	};
};

const LD_ = (register) => {
	return (cpu, value) => {
		cpu.registers[register].value = value;
		cpu.flags.updateZeroAndNegative(value);
	};
};

export default instructions();
