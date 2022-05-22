import { Counter } from "../synthesis";
import { WithContext } from "../../helpers";

/**
 * The noise channel produces noise with a pseudo-random bit generator. It supports:
 *   - note lengths
 *   - volume envelope / constant volume
 */
export default class NoiseChannel {
	constructor() {
		WithContext.apply(this);

		this.lengthCounter = new Counter();
	}

	/** Generates a new sample. */
	sample() {
		// const { apu } = this.context;
		if (!this.isEnabled) return 0;

		return !this.lengthCounter.didFinish ? (Math.random() * 2 - 1) * 0.3 : 0;
	}

	/** Updates length counter and sweep values. */
	clock() {
		this.lengthCounter.clock(this.isEnabled, this.registers.control.halt);
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
