import { Oscillator, Counter } from "../synthesis";
import constants from "../../constants";
import { WithContext, Byte } from "../../helpers";

const AMPLITUDE = 0.15;
const HARMONICS = 20;

export default class PulseChannel {
	constructor(id, enableFlagName) {
		WithContext.apply(this);

		this.id = id;
		this.enableFlagName = enableFlagName;

		this.oscillator = new Oscillator(AMPLITUDE, HARMONICS);
		this.lengthCounter = new Counter();
	}

	sample() {
		const { apu } = this.context;
		if (!this.isEnabled) return 0;

		const timer = Byte.to16Bit(
			this.registers.lclTimerHigh.timerHigh,
			this.registers.timerLow.value
		);

		this.oscillator.dutyCycle = this.registers.control.dutyCycle;
		this.oscillator.frequency = constants.FREQ_CPU_HZ / (16 * (timer + 1));
		// from nesdev: f = fCPU / (16 * (t + 1))

		return !this.lengthCounter.hasDone ? this.oscillator.sample(apu.time) : 0;
	}

	clock() {
		this.lengthCounter.clock(this.isEnabled, this.registers.control.halt);

		// pulse1_lc.clock(pulse1_enable, pulse1_halt); OK
		// pulse2_lc.clock(pulse2_enable, pulse2_halt); OK
		// noise_lc.clock(noise_enable, noise_halt);
		// pulse1_sweep.clock(pulse1_seq.reload, 0);
		// pulse2_sweep.clock(pulse2_seq.reload, 1);
	}

	get isEnabled() {
		return this.context.apu.registers.apuControl[this.enableFlagName];
	}

	get registers() {
		return this.context.apu.registers.pulses[this.id];
	}
}
