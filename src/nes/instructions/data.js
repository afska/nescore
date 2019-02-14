const LD_ = (register) => {
	return (cpu, value) => {
		cpu.registers[register].value = value;
		if (value === 0) cpu.flags.z = true;
		if (value & 0b10000000) cpu.flags.n = true;
	};
};

export default [
	/**
	 * Load Accumulator
	 *
	 * Loads `value` into A, setting the Z (zero) and N (negative) flags.
	 */
	{
		name: "LDA",
		execute: LD_("a")
	},

	/**
	 * Load Y Register
	 *
	 * Loads `value` into Y, setting the Z (zero) and N (negative) flags.
	 */
	{
		name: "LDX",
		execute: LD_("x")
	},

	/**
	 * Load Y Register
	 *
	 * Loads `value` into Y, setting the Z (zero) and N (negative) flags.
	 */
	{
		name: "LDY",
		execute: LD_("y")
	}
];
