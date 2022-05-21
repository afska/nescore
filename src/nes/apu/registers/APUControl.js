import { InMemoryRegister } from "../../registers";

export default class APUControl extends InMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("enablePulse1", 0)
			.addReadOnlyField("enablePulse2", 1)
			.addReadOnlyField("enableTriangle", 2)
			.addReadOnlyField("enableNoise", 3)
			.addReadOnlyField("enableDMC", 4);
	}
}
