import { WriteOnlyInMemoryRegister } from "../../registers";

export default class NoiseForm extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("period", 0, 4).addReadOnlyField("loop", 7);
	}
}
