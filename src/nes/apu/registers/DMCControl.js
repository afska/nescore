import { dpcmPeriods } from "../constants";
import { WriteOnlyInMemoryRegister } from "../../registers";

/** Sets options for the DMC channel. */
export default class DMCControl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("dpcmPeriodId", 0, 4)
			.addReadOnlyField("loop", 6)
			.addField("irqEnable", 7);
	}

	/** Returns the DPCM period. */
	get dpcmPeriod() {
		return dpcmPeriods[this.dpcmPeriodId];
	}
}
