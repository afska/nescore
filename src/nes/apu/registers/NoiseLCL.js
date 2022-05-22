import { WriteOnlyInMemoryRegister } from "../../registers";
import { lengthTable } from "../constants";

export default class NoiseLCL extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("lengthCounterLoad", 3, 5);
	}

	// /** TODO. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.channels.noise.lengthCounter.counter =
			lengthTable[this.lengthCounterLoad];
	}
}
