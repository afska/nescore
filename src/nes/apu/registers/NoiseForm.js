import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the sound output of the Noise channel. */
export default class NoiseForm extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("period", 0, 4).addReadOnlyField("loop", 7);
		// (ignored on this emulator)
	}
}
