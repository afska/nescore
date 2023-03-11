import { TriangleOscillator, LengthCounter } from "../synthesis";
import constants from "../../constants";
import { WithContext, Byte } from "../../helpers";

/**
 * The triangle channel produces a quantized triangle wave. It supports:
 *   - note lengths
 *   - an extra high-resolution ("linear") length counter
 */
export default class TriangleChannel {
	constructor() {
		WithContext.apply(this);

		this.oscillator = new TriangleOscillator();
		this.lengthCounter = new LengthCounter();
		this.linearLengthCounter = new LengthCounter();
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = context.apu.registers.triangle;
	}

	/** Generates a new sample. */
	sample() {
		const { apu } = this.context;
		if (!this.isEnabled) return 0;

		const timer = Byte.to16Bit(
			this.registers.lclTimerHigh.timerHigh,
			this.registers.timerLow.value
		);

		this.oscillator.frequency = constants.FREQ_CPU_HZ / (16 * (timer + 1)) / 2;
		// from nesdev: f = fCPU / (16 * (t + 1))
		// (the pitch is one octave below the pulse channels with an equivalent timer value)
		// (i.e. use the formula above but divide the resulting frequency by two).

		return !this.lengthCounter.didFinish && !this.linearLengthCounter.didFinish
			? this.oscillator.sample(apu.time)
			: 0;
	}

	/** Updates linear length counter. */
	quarterBeat() {
		this.linearLengthCounter.clock(
			this.isEnabled,
			this.registers.linearLCL.halt
		);
	}

	/** Updates length counter. */
	halfBeat() {
		this.lengthCounter.clock(this.isEnabled, this.registers.linearLCL.halt);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			oscillator: this.oscillator.getSaveState(),
			lengthCounter: this.lengthCounter.getSaveState(),
			linearLengthCounter: this.linearLengthCounter.getSaveState()
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.oscillator.setSaveState(saveState.oscillator);
		this.lengthCounter.setSaveState(saveState.lengthCounter);
		this.linearLengthCounter.setSaveState(saveState.linearLengthCounter);
	}

	/** Returns whether the channel is enabled or not. */
	get isEnabled() {
		return this.context.apu.registers.apuControl.enableTriangle;
	}
}
