import { WriteOnlyInMemoryRegister } from "../../registers";

/** Sets options for the DMC channel. */
export default class DMCControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("dpcmRate", 0, 4)
			.addReadOnlyField("loop", 6)
			.addField("irqEnable", 7);
	}
}
