import { dpcmRates } from "../constants";
import { WriteOnlyInMemoryRegister } from "../../registers";

/** Sets options for the DMC channel. */
export default class DMCControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("dpcmRateId", 0, 4)
			.addReadOnlyField("loop", 6)
			.addField("irqEnable", 7);
	}

	/** Returns the DPCM rate. */
	get dpcmRate() {
		return dpcmRates[this.dpcmRateId];
	}
}
