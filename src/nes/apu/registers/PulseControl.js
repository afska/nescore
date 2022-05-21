import { WriteOnlyInMemoryRegister } from "../../registers";

export default class PulseControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("volumeOrEnvelopePeriod", 0, 4)
			.addReadOnlyField("constantVolume", 4)
			.addReadOnlyField("lengthCounterHalt", 5)
			.addReadOnlyField("dutyCycle", 6, 2);
	}
}
