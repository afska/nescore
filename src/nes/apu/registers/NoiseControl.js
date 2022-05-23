import { WriteOnlyInMemoryRegister } from "../../registers";

/** Sets options for the Noise channel. */
export default class NoiseControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("volumeOrEnvelopePeriod", 0, 4)
			.addReadOnlyField("constantVolume", 4)
			.addReadOnlyField("envelopeLoopOrLengthCounterHalt", 5);
	}
}
