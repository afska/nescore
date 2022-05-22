import {
	PulseOscillator,
	LengthCounter,
	VolumeEnvelope,
	FrequencySweeper
} from "../synthesis";
import constants from "../../constants";
import { WithContext, Byte } from "../../helpers";

/**
 * The pulse channels produce a variable-width pulse signal. They support:
 *   - different duty cycles
 *   - note lengths
 *   - volume envelope / constant volume
 *   - frequency sweeping
 */
export default class PulseChannel {
	constructor(id, enableFlagName) {
		WithContext.apply(this);

		this.id = id;
		this.enableFlagName = enableFlagName;

		this.oscillator = new PulseOscillator();
		this.lengthCounter = new LengthCounter();
		this.volumeEnvelope = new VolumeEnvelope();
		this.frequencySweeper = new FrequencySweeper();
	}

	/** Generates a new sample. */
	sample() {
		const { apu } = this.context;
		if (!this.isEnabled) return 0;

		const timer = Byte.to16Bit(
			this.registers.lclTimerHigh.timerHigh,
			this.registers.timerLow.value
		);

		if (timer < 8) {
			// (if t < 8, the pulse channel is silenced)
			return 0;
		}

		this.oscillator.dutyCycle = this.registers.control.dutyCycle;
		this.oscillator.frequency = constants.FREQ_CPU_HZ / (16 * (timer + 1));
		// from nesdev: f = fCPU / (16 * (t + 1))

		const volume = this.registers.control.constantVolume
			? this.registers.control.volumeOrEnvelopePeriod
			: this.volumeEnvelope.volume;
		this.oscillator.amplitude = volume / constants.APU_MAX_VOLUME;

		return !this.lengthCounter.didFinish ? this.oscillator.sample(apu.time) : 0;
	}

	/** Updates the envelope. */
	fastClock() {
		this.volumeEnvelope.clock(
			this.registers.control.volumeOrEnvelopePeriod,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
	}

	/** Updates length counter and sweep values. */
	clock() {
		this.lengthCounter.clock(
			this.isEnabled,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
		// TODO: UPDATE SWEEP: pulse1_sweep.clock(pulse1_seq.reload, 0);
	}

	/** Returns whether the channel is enabled or not. */
	get isEnabled() {
		return this.context.apu.registers.apuControl[this.enableFlagName];
	}

	/** Returns the channel's register set. */
	get registers() {
		return this.context.apu.registers.pulses[this.id];
	}
}
