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
		return dpcmPeriods[this.dpcmPeriodId] / 2;
		//                                    ^^^
		// These periods are all even numbers because there are 2 CPU cycles in an APU cycle.
		// A rate of 428 means the output level changes every 214 APU cycles.
	}
}
