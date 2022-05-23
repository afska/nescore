import { LengthCounter } from "../synthesis";
import { WithContext } from "../../helpers";

/**
 * The delta modulation channel (DMC) can output 1-bit delta-encoded samples or can
 * have its 7-bit counter directly loaded. This allows flexible manual sample playback.
 */
export default class DMCChannel {
	constructor() {
		WithContext.apply(this);

		this.lengthCounter = new LengthCounter();
	}

	/** Generates a new sample. */
	sample() {
		if (!this.isEnabled) return 0;

		// TODO: IMPLEMENT

		return !this.lengthCounter.didFinish ? 1 : 0;
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
		return this.context.apu.registers.apuControl.enableDMC;
	}

	/** Returns the channel's register set. */
	get registers() {
		return this.context.apu.registers.dmc;
	}
}
