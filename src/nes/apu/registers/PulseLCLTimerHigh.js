import { WriteOnlyInMemoryRegister } from "../../registers";
import { lengthTable } from "../constants";

/** Sets the high 3 bits of a Pulse channel's timer and its length counter. */
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

	/** Updates timer value, length counter, and volume envelope's start flag. */
	writeAt(__, byte) {
		this.setValue(byte);

		const channel = this.context.apu.channels.pulses[this.id];
		channel.updateTimer();
		channel.lengthCounter.counter = lengthTable[this.lengthCounterLoad];
		channel.volumeEnvelope.startFlag = true;
	}
}
