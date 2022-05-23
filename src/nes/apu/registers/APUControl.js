import { InMemoryRegister } from "../../registers";

/** Enables or disables APU channels. */
export default class APUControl extends InMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("enablePulse1", 0)
			.addReadOnlyField("enablePulse2", 1)
			.addReadOnlyField("enableTriangle", 2)
			.addReadOnlyField("enableNoise", 3)
			.addReadOnlyField("enableDMC", 4);
	}

	/** When a channel is disabled, it resets its length counters. */
	writeAt(__, byte) {
		const {
			enablePulse1,
			enablePulse2,
			enableTriangle,
			enableNoise,
			enableDMC
		} = this;
		const { channels } = this.context.apu;

		this.setValue(byte);

		if (enablePulse1 && !this.enablePulse1)
			channels.pulses[0].lengthCounter.counter = 0;
		if (enablePulse2 && !this.enablePulse2)
			channels.pulses[1].lengthCounter.counter = 0;
		if (enableTriangle && !this.enableTriangle) {
			channels.triangle.lengthCounter.counter = 0;
			channels.triangle.linearLengthCounter.counter = 0;
		}
		if (enableNoise && !this.enableNoise)
			channels.noise.lengthCounter.counter = 0;
	}
}
