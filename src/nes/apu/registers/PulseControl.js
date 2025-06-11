import { WriteOnlyInMemoryRegister } from "../../registers";

/** Sets options for a Pulse channel. */
export default class PulseControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("volumeOrEnvelopePeriod", 0, 4)
			.addReadOnlyField("constantVolume", 4)
			.addReadOnlyField("envelopeLoopOrLengthCounterHalt", 5)
			.addReadOnlyField("dutyCycleId", 6, 2);
	}
}
