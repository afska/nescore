import { InMemoryRegister } from "../../registers";

export default class APUControl extends InMemoryRegister {
	constructor() {
		super();

		this.addField("enablePulse1", 0)
			.addField("enablePulse2", 1)
			.addField("enableTriangle", 2)
			.addField("enableNoise", 3)
			.addField("enableDMC", 4);
	}
}
