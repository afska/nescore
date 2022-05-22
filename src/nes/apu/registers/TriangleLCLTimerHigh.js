import { WriteOnlyInMemoryRegister } from "../../registers";

export default class LCLTimerHigh extends WriteOnlyInMemoryRegister {
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

		this.context.apu.channels.triangle.lengthCounter.counter = this.lengthCounterLoad;
	}
}
