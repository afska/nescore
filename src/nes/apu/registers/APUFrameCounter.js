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

	/** Resets the APU Frame Counter and fires the appropriate callbacks. */
	writeAt(__, byte) {
		this.setValue(byte);

		const { apu } = this.context;

		apu.frameClockCounter = 0;
		apu._onQuarter();
		apu._onHalf();
	}
}
