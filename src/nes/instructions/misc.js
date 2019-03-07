const instructions = () => [
	/**
	 * Force Interrupt
	 *
	 * Forces the generation of an interrupt request.
	 * The program counter and flags are pushed on the stack, then the IRQ
	 * interrupt vector at $FFFE/F is loaded into the PC and the B flags are set.
	 */
	{
		id: "BRK",
		execute: ({ cpu }) => {
			cpu.flags.b1 = true;
			cpu.flags.b2 = true;
			cpu.interrupt("IRQ");
		}
	},

	/**
	 * No Operation
	 *
	 * Causes no changes at all.
	 */
	{
		id: "NOP",
		execute: (context) => {}
	}
];

export default instructions();

// TODO: Test these instructions
