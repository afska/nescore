import { signedByte } from "../helpers";

const instructions = () => [
	/**
	 * Clear Carry Flag
	 *
	 * Clears the C (carry) flag.
	 */
	{
		name: "CLC",
		execute: CL_("c")
	},

	/**
	 * Clear Decimal Mode
	 *
	 * Clears the D (decimal mode) flag.
	 */
	{
		name: "CLD",
		execute: CL_("d")
	},

	/**
	 * Clear Interrupt Disable
	 *
	 * Clears the I (interrupt disable) flag.
	 */
	{
		name: "CLI",
		execute: CL_("i")
	},

	/**
	 * Clear Overflow Flag
	 *
	 * Clears the V (overflow) flag.
	 */
	{
		name: "CLV",
		execute: CL_("v")
	},

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

const CL_ = (flag) => {
	return (cpu) => {
		cpu.flags[flag] = false;
	};
};

const LD_ = (register) => {
	return (cpu, value) => {
		cpu.registers[register].value = value;
		if (value === 0) cpu.flags.z = true;
		if (signedByte.isNegative(value)) cpu.flags.n = true;
	};
};

export default instructions();
