import { WriteOnlyInMemoryRegister } from "../../registers";

/** Sets the low 8 bits of a Pulse channel's timer. */
export default class PulseTimerLow extends WriteOnlyInMemoryRegister {
	constructor(id) {
		super();

		this.id = id;
	}

	/** Updates timer value. */
	writeAt(__, byte) {
		this.setValue(byte);

		const channel = this.context.apu.channels.pulses[this.id];
		channel.updateTimer();
	}
}
