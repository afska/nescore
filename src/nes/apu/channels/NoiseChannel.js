import { NoiseOscillator, LengthCounter, VolumeEnvelope } from "../synthesis";
import constants from "../../constants";
import { WithContext } from "../../helpers";

/**
 * The noise channel produces noise with a pseudo-random bit generator. It supports:
 *   - note lengths
 *   - volume envelope / constant volume
 */
export default class NoiseChannel {
	constructor() {
		WithContext.apply(this);

		this.oscillator = new NoiseOscillator();
		this.lengthCounter = new LengthCounter();
		this.volumeEnvelope = new VolumeEnvelope();
	}

	/** Generates a new sample. */
	sample() {
		if (!this.isEnabled) return 0;

		const volume = this.registers.control.constantVolume
			? this.registers.control.volumeOrEnvelopePeriod
			: this.volumeEnvelope.volume;
		this.oscillator.amplitude = volume / constants.APU_MAX_VOLUME;

		return !this.lengthCounter.didFinish ? this.oscillator.sample() : 0;
	}

	/** Updates the envelope. */
	fastClock() {
		this.volumeEnvelope.clock(
			this.registers.control.volumeOrEnvelopePeriod,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
	}

	/** Updates length counter. */
	clock() {
		this.lengthCounter.clock(
			this.isEnabled,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
	}

	/** Returns whether the channel is enabled or not. */
	get isEnabled() {
		return this.context.apu.registers.apuControl.enableNoise;
	}

	/** Returns the channel's register set. */
	get registers() {
		return this.context.apu.registers.noise;
	}
}
