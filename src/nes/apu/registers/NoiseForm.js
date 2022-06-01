import { WriteOnlyInMemoryRegister } from "../../registers";
import { noisePeriods } from "../constants";

/** Controls the sound output of the Noise channel. */
export default class NoiseForm extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("periodId", 0, 4).addReadOnlyField("loop", 7);
	}

	/** Returns the noise period. */
	get period() {
		return noisePeriods[this.periodId];
	}
}
