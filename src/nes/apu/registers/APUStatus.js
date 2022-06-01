import { InMemoryRegister } from "../../registers";

/** Returns the current status of the APU. */
export default class APUStatus extends InMemoryRegister {
	constructor() {
		super();

		this.addField("lcPulse1", 0)
			.addField("lcPulse2", 1)
			.addField("lcTriangle", 2)
			.addField("lcNoise", 3)
			.addField("remainingBytesDMC", 4)
			.addField("frameIRQFlag", 6)
			.addField("dmcIRQFlag", 7);
	}

	/** Reads the status and resets the frame IRQ flag. */
	readAt() {
		const { apu } = this.context;
		const channels = apu.channels;

		this.lcPulse1 = +(channels.pulses[0].lengthCounter.counter > 0);
		this.lcPulse2 = +(channels.pulses[1].lengthCounter.counter > 0);
		this.lcTriangle = +(channels.triangle.lengthCounter.counter > 0);
		this.remainingBytesDMC = channels.dmc.remainingBytes;
		this.frameIRQFlag = apu.frameIRQFlag;
		this.dmcIRQFlag = apu.registers.dmc.control.irqEnable;

		if (!this.context.isDebugging) apu.frameIRQFlag = false;

		return this.value;
	}
}
