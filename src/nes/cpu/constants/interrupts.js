import _ from "lodash";

const interrupts = [
	// Non-maskable interrupt (triggered by the PPU during VBlank, if enabled)
	{
		id: "NMI",
		vector: 0xfffa
	},

	// Reset (triggered when the system is powered on or reset)
	{
		id: "RESET",
		vector: 0xfffc
	},

	// Maskable interrupt request (triggered by hardware like mappers)
	{
		id: "IRQ",
		vector: 0xfffe
	},

	// Software interrupt (triggered by executing the BRK instruction)
	{
		id: "BRK",
		vector: 0xfffe
	}
];

export default _.keyBy(interrupts, "id");
