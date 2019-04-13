import _ from "lodash";

const interrupts = [
	// Non-maskable interrupt (used to detect vertical blanking)
	{
		id: "NMI",
		vector: 0xfffa
	},

	// Reset
	{
		id: "RESET",
		vector: 0xfffc
	},

	// Interrupt request (temporarily stops the current program, and run an interrupt handler instead)
	{
		id: "IRQ",
		vector: 0xfffe
	}
];

export default _.keyBy(interrupts, "id");
