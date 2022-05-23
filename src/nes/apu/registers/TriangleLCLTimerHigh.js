import { WriteOnlyInMemoryRegister } from "../../registers";
import { lengthTable } from "../constants";

/** Sets the high 3 bits of the Triangle channel's timer and its length counter. */
export default class TriangleLCLTimerHigh extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("timerHigh", 0, 3).addReadOnlyField(
			"lengthCounterLoad",
			3,
			5
		);
	}

	/** Updates the length counter. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.channels.triangle.lengthCounter.counter =
			lengthTable[this.lengthCounterLoad];
	}
}
