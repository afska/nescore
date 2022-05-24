import { WriteOnlyInMemoryRegister } from "../../registers";
import { lengthTable } from "../constants";

/** Controls the length counter value of the Noise channel. */
export default class NoiseLCL extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("lengthCounterLoad", 3, 5);
	}

	/** Updates the length counter. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.channels.noise.lengthCounter.counter =
			lengthTable[this.lengthCounterLoad];
	}
}
