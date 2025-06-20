import { LengthCounter, VolumeEnvelope } from "../synthesis";
import config from "../../config";
import { WithContext, Byte } from "../../helpers";

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

		this.shift = 0b1; // (the shift register is 15 bits wide)
		this.dividerCount = 0;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = context.apu.registers.noise;
	}

	/** Generates a new sample. */
	sample() {
		if (!this.isEnabled) return 0;

		const volume = this.registers.control.constantVolume
			? this.registers.control.volumeOrEnvelopePeriod
			: this.volumeEnvelope.volume;

		this._processNoise();

		/*
		 * The mixer receives **the volume** except when
		 *   - Bit 0 of the shift register is set, or
		 *   - The length counter is zero
		 */
		return !this.lengthCounter.didFinish && !Byte.getBit(this.shift, 0)
			? volume * config.NOISE_CHANNEL_VOLUME
			: 0;
	}

	/** Updates the envelope. */
	quarterBeat() {
		this.volumeEnvelope.clock(
			this.registers.control.volumeOrEnvelopePeriod,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
	}

	/** Updates length counter. */
	halfBeat() {
		this.lengthCounter.clock(
			this.isEnabled,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			lengthCounter: this.lengthCounter.getSaveState(),
			volumeEnvelope: this.volumeEnvelope.getSaveState(),
			shift: this.shift,
			dividerCount: this.dividerCount
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.lengthCounter.setSaveState(saveState.lengthCounter);
		this.volumeEnvelope.setSaveState(saveState.volumeEnvelope);
		this.shift = saveState.shift;
		this.dividerCount = saveState.dividerCount;
	}

	/** Returns whether the channel is enabled or not. */
	get isEnabled() {
		return this.context.apu.registers.apuControl.enableNoise;
	}

	_processNoise() {
		this.dividerCount++;
		if (this.dividerCount >= this.registers.form.period) this.dividerCount = 0;
		else return;

		/**
		 * When the timer clocks the shift register, the following actions occur in order:
		 *   1. Feedback is calculated as the exclusive-OR of bit 0 and one other bit: bit 6 if Mode flag is set, otherwise bit 1.
		 *   2. The shift register is shifted right by one bit.
		 *   3. Bit 14, the leftmost bit, is set to the feedback calculated earlier.
		 */

		const bitPosition = this.registers.form.mode ? 6 : 1;

		const bit = Byte.getBit(this.shift, bitPosition);
		const feedback = Byte.getBit(this.shift, 0) ^ bit;

		this.shift = (this.shift >> 1) | (feedback << 14);
	}
}
