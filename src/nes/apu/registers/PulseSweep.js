import { WriteOnlyInMemoryRegister } from "../../registers";

export default class PulseSweep extends WriteOnlyInMemoryRegister {
	constructor(id) {
		super();

		this.id = id;
		this.addReadOnlyField("shiftCount", 0, 3)
			.addReadOnlyField("negateFlag", 3)
			.addReadOnlyField("dividerPeriodMinusOne", 4, 3)
			.addReadOnlyField("enabledFlag", 7);
	}

	// /** TODO. */
	writeAt(__, byte) {
		this.setValue(byte);

		const channel = this.context.apu.channels.pulses[this.id];
		channel.frequencySweeper.startFlag = true;
	}
}
