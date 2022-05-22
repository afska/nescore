import { WriteOnlyInMemoryRegister } from "../../registers";
import { lengthTable } from "../constants";

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

		const channel = this.context.apu.channels.pulses[this.id];
		channel.lengthCounter.counter = lengthTable[this.lengthCounterLoad];
		channel.volumeEnvelope.startFlag = true;
	}
}
