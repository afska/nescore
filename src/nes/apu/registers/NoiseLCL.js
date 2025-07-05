import { WriteOnlyInMemoryRegister } from "../../registers";
import { lengthTable } from "../constants";

/** Controls the length counter value of the Noise channel. */
export default class NoiseLCL extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("lengthCounterLoad", 3, 5);
	}

	/** Updates the length counter, and volume envelope's start flag. */
	writeAt(__, byte) {
		this.setValue(byte);

		const channel = this.context.apu.channels.noise;
		channel.lengthCounter.counter = lengthTable[this.lengthCounterLoad];
		channel.volumeEnvelope.startFlag = true;
	}
}
