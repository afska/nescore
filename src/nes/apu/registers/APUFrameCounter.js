import { WriteOnlyInMemoryRegister } from "../../registers";

/** Sets frame counter options (e.g. sequence type). */
export default class APUFrameCounter extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("interruptInhibitFlag", 6).addReadOnlyField(
			"use5StepSequencer",
			7
		);
	}
}
