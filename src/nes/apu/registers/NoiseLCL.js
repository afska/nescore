import { WriteOnlyInMemoryRegister } from "../../registers";

export default class NoiseLCL extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("lengthCounterLoad", 3, 5);
	}
}
