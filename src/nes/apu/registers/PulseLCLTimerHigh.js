import { WriteOnlyInMemoryRegister } from "../../registers";

const LENGTH_TABLE = [
	10,
	254,
	20,
	2,
	40,
	4,
	80,
	6,
	160,
	8,
	60,
	10,
	14,
	12,
	26,
	14,
	12,
	16,
	24,
	18,
	48,
	20,
	96,
	22,
	192,
	24,
	72,
	26,
	16,
	28,
	32,
	30
];

export default class PulseLCLTimerHigh extends WriteOnlyInMemoryRegister {
	constructor(id) {
		super();

		this.id = id;
		this.addReadOnlyField("timerHigh", 0, 3).addReadOnlyField(
			"lengthCounterLoad",
			4,
			5
		);
	}

	// /** TODO. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.lengthCounters[this.id].counter =
			LENGTH_TABLE[(byte & 0xf8) >> 3];
		// TODO: UNDERSTAND?
		// https://www.nesdev.org/wiki/APU_Length_Counter
	}
}
