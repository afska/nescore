import { WriteOnlyInMemoryRegister } from "../../registers";

export default class PulseControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addField("volumeOrEnvelopePeriod", 0, 4)
			.addField("constantVolume", 4)
			.addField("lengthCounterHalt", 5)
			.addField("dutyCycle", 6, 2);
	}
}
