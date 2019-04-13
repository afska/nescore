import { interrupts } from "../constants";

const instructions = () => [
	/**
	 * Force Interrupt
	 *
	 * Forces the generation of an interrupt request.
	 * The program counter and flags (with B2 set) are pushed on the stack, then the IRQ
	 * interrupt vector at $FFFE/F is loaded into the PC.
	 */
	{
		id: "BRK",
		execute: ({ cpu }) => {
			cpu.interrupt(interrupts.IRQ, true);
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
