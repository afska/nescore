import { WriteOnlyInMemoryRegister } from "../../registers";
import { lengthTable } from "../constants";

export default class TriangleLCLTimerHigh extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("timerHigh", 0, 3).addReadOnlyField(
			"lengthCounterLoad",
			3,
			5
		);
	}

	// /** TODO. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.channels.triangle.lengthCounter.counter =
			lengthTable[this.lengthCounterLoad];
	}
}
