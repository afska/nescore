import { lengthTable } from "../constants";
import { WriteOnlyInMemoryRegister } from "../../registers";

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
			lengthTable[this.lengthCounterLoad];
	}
}
