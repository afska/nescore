import { WriteOnlyInMemoryRegister } from "../../registers";

/** Enables or disables APU channels. */
export default class APUControl extends WriteOnlyInMemoryRegister {
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
		const { channels } = this.context.apu;

		this.setValue(byte);

		const {
			enablePulse1,
			enablePulse2,
			enableTriangle,
			enableNoise,
			enableDMC
		} = this;

		if (!enablePulse1) channels.pulses[0].lengthCounter.counter = 0;
		if (!enablePulse2) channels.pulses[1].lengthCounter.counter = 0;
		if (!enableTriangle) {
			channels.triangle.lengthCounter.counter = 0;
			channels.triangle.linearLengthCounter.counter = 0;
		}
		if (!enableNoise) channels.noise.lengthCounter.counter = 0;

		if (!enableDMC) channels.dmc.stopDPCM();
		else if (channels.dmc.remainingBytes === 0) channels.dmc.startDPCM();

		this.context.apu.registers.dmc.irqEnable = 0;
	}
}
