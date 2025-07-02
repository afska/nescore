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
		this.timer = 0;

		this.outputSample = 0;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = context.apu.registers.pulses[this.id];
	}

	/** Generates a new sample. */
	sample(isNewSample) {
		if (!this.isEnabled) return this.outputSample;

		this.oscillator.dutyCycle = this.registers.control.dutyCycle;
		this.oscillator.frequency = constants.FREQ_CPU_HZ / (16 * (this.timer + 1));
		// from nesdev: f = fCPU / (16 * (t + 1))

		this.oscillator.volume = this.registers.control.constantVolume
			? this.registers.control.volumeOrEnvelopePeriod
			: this.volumeEnvelope.volume;

		const isActive =
			!this.lengthCounter.didFinish && !this.frequencySweeper.mute;
		if (isActive) this.outputSample = this.oscillator.sample(isNewSample);

		return this.outputSample;
	}

	/** Updates the full timer value from the registers. */
	updateTimer() {
		this.timer = Byte.to16Bit(
			this.registers.lclTimerHigh.timerHigh,
			this.registers.timerLow.value
		);
	}

	/** Updates the timer and sweep if needed. */
	cycle() {
		// (frequency sweepers change at a higher frequency)
		for (let i = 0; i < constants.APU_HIGH_FREQUENCY_CYCLES; i++)
			this.frequencySweeper.track(this);

		if (!this.registers.sweep.enabledFlag) this.updateTimer();
	}

	/** Updates the envelope. */
	quarterBeat() {
		this.volumeEnvelope.clock(
			this.registers.control.volumeOrEnvelopePeriod,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
	}

	/** Updates length counter and sweep values. */
	halfBeat() {
		this.lengthCounter.clock(
			this.isEnabled,
			this.registers.control.envelopeLoopOrLengthCounterHalt
		);
		this.frequencySweeper.clock(this);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			outputSample: this.outputSample,
			oscillator: this.oscillator.getSaveState(),
			lengthCounter: this.lengthCounter.getSaveState(),
			volumeEnvelope: this.volumeEnvelope.getSaveState(),
			frequencySweeper: this.frequencySweeper.getSaveState(),
			timer: this.timer
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.outputSample = saveState.outputSample;
		this.oscillator.setSaveState(saveState.oscillator);
		this.lengthCounter.setSaveState(saveState.lengthCounter);
		this.volumeEnvelope.setSaveState(saveState.volumeEnvelope);
		this.frequencySweeper.setSaveState(saveState.frequencySweeper);
		this.timer = saveState.timer;
	}

	/** Returns whether the channel is enabled or not. */
	get isEnabled() {
		return this.context.apu.registers.apuControl[this.enableFlagName];
	}
}
