import { LengthCounter, VolumeEnvelope } from "../synthesis";
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

		this.lengthCounter = new LengthCounter();
		this.volumeEnvelope = new VolumeEnvelope();
	}

	/** Generates a new sample. */
	sample() {
		// const { apu } = this.context;
		if (!this.isEnabled) return 0;

		const volume = this.registers.control.constantVolume
			? this.registers.control.volumeOrEnvelopePeriod
			: this.volumeEnvelope.volume;

		return !this.lengthCounter.didFinish
			? (Math.random() * 2 - 1) * 0.3 * (volume / constants.APU_MAX_VOLUME)
			: 0;
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
