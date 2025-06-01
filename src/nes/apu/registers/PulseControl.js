import { WriteOnlyInMemoryRegister } from "../../registers";

const DUTY_CYCLES = [0.125, 0.25, 0.5, 0.75];

/** Sets options for a Pulse channel. */
export default class PulseControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("volumeOrEnvelopePeriod", 0, 4)
			.addReadOnlyField("constantVolume", 4)
			.addReadOnlyField("envelopeLoopOrLengthCounterHalt", 5)
			.addReadOnlyField("dutyCycleId", 6, 2);
	}

	/** Returns the duty cycle (0.125, 0.25, 0.5, or 0.75). */
	get dutyCycle() {
		return DUTY_CYCLES[this.dutyCycleId];
	}
}
