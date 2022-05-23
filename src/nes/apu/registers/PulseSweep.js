import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the frequency sweeper of a Pulse channel. */
export default class PulseSweep extends WriteOnlyInMemoryRegister {
	constructor(id) {
		super();

		this.id = id;
		this.addReadOnlyField("shiftCount", 0, 3)
			.addReadOnlyField("negateFlag", 3)
			.addReadOnlyField("dividerPeriodMinusOne", 4, 3)
			.addReadOnlyField("enabledFlag", 7);
	}

	/** Sets the start flag of the frequency sweeper. */
	writeAt(__, byte) {
		this.setValue(byte);

		const channel = this.context.apu.channels.pulses[this.id];
		channel.frequencySweeper.startFlag = true;
	}
}
