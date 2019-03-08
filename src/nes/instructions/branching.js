const instructions = () => [
	/**
	 * Branch if Carry Clear
	 *
	 * If the C flag is clear, jumps to `address`.
	 */
	{
		id: "BCC",
		execute: B__("c", false)
	},

	/**
	 * Branch if Carry Set
	 *
	 * If the C flag is set, jumps to `address`.
	 */
	{
		id: "BCS",
		execute: B__("c", true)
	},

	/**
	 * Branch if Equal
	 *
	 * If the Z flag is set, jumps to `address`.
	 */
	{
		id: "BEQ",
		execute: B__("z", true)
	},

	/**
	 * Branch if Minus
	 *
	 * If the N flag is set, jumps to `address`.
	 */
	{
		id: "BMI",
		execute: B__("n", true)
	},

	/**
	 * Branch if Not Equal
	 *
	 * If the Z flag is clear, jumps to `address`.
	 */
	{
		id: "BNE",
		execute: B__("z", false)
	},

	/**
	 * Branch if Positive
	 *
	 * If the N flag is clear, jumps to `address`.
	 */
	{
		id: "BPL",
		execute: B__("n", false)
	},

	/**
	 * Branch if Overflow Clear
	 *
	 * If the V flag is clear, jumps to `address`.
	 */
	{
		id: "BVC",
		execute: B__("v", false)
	},

	/**
	 * Branch if Overflow Set
	 *
	 * If the V flag is set, jumps to `address`.
	 */
	{
		id: "BVS",
		execute: B__("v", true)
	},

	/**
	 * Jump
	 *
	 * Jumps to `address`.
	 */
	{
		id: "JMP",
		execute: ({ cpu }, address) => {
			cpu.pc.value = address;
		}
	},

	/**
	 * Jump to Subroutine
	 *
	 * Pushes the current program counter (minus one) on to the stack and jumps to `address`.
	 */
	{
		id: "JSR",
		execute: ({ cpu }, address) => {
			cpu.stack.push2Bytes(cpu.pc.value - 1);
			cpu.pc.value = address;
		}
	},

	/**
	 * Return from Interrupt
	 *
	 * Pulls the flags from the stack followed by the program counter.
	 */
	{
		id: "RTI",
		execute: ({ cpu }) => {
			cpu.flags.load(cpu.stack.pop());
			cpu.pc.value = cpu.stack.pop2Bytes();
		}
	},

	/**
	 * Return from Subroutine
	 *
	 * Pulls the program counter (plus one) from the stack.
	 */
	{
		id: "RTS",
		execute: ({ cpu }) => {
			cpu.pc.value = cpu.stack.pop2Bytes() + 1;
		}
	}
];

const B__ = (flag, value) => {
	return ({ cpu }, address) => {
		if (cpu.flags[flag] === value) {
			cpu.pc.value = address;
			cpu.cycles++;
		}
	};
};

export default instructions();
