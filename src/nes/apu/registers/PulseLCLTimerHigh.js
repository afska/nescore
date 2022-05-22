import { lengthTable } from "../constants";
import { WriteOnlyInMemoryRegister } from "../../registers";

export default class PulseLCLTimerHigh extends WriteOnlyInMemoryRegister {
	constructor(id) {
		super();

		this.id = id;
		this.addReadOnlyField("timerHigh", 0, 3).addReadOnlyField(
			"lengthCounterLoad",
			3,
			5
		);
	}

	// /** TODO. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.channels.pulses[this.id].lengthCounter.counter =
			lengthTable[this.lengthCounterLoad];
	}
}
