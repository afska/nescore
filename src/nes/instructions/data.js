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
	},

	/**
	 * Set Carry Flag
	 *
	 * Sets the C (carry) flag.
	 */
	{
		id: "SEC",
		execute: SE_("c")
	},

	/**
	 * Set Decimal Flag
	 *
	 * Sets the D (decimal) flag.
	 */
	{
		id: "SED",
		execute: SE_("d")
	},

	/**
	 * Set Interrupt Disable
	 *
	 * Sets the I (interrupt disable) flag.
	 */
	{
		id: "SEI",
		execute: SE_("i")
	},

	/**
	 * Store Accumulator
	 *
	 * Stores the contents of A into `address`.
	 */
	{
		id: "STA",
		execute: ST_("a")
	}
];

const SE_ = (flag) => {
	return ({ cpu }) => {
		cpu.flags[flag] = true;
	};
};

const CL_ = (flag) => {
	return ({ cpu }) => {
		cpu.flags[flag] = false;
	};
};

const LD_ = (register) => {
	return ({ cpu }, value) => {
		cpu.registers[register].value = value;
		cpu.flags.updateZeroAndNegative(value);
	};
};

const ST_ = (register) => {
	return ({ cpu, memory }, address) => {
		const value = cpu.registers[register].value;
		memory.writeAt(address, value);
	};
};

export default instructions();
