import { WithContext } from "../../helpers";

const BASE_VOLUME = 0.01;

/**
 * The delta modulation channel (DMC) can output 1-bit delta-encoded samples or can
 * have its 7-bit counter directly loaded. This allows flexible manual sample playback.
 */
export default class DMCChannel {
	constructor() {
		WithContext.apply(this);
	}

	/** Generates a new sample. */
	sample() {
		// if (!this.isEnabled) return 0;
		// (the output level is sent to the mixer whether the channel is enabled or not)

		return this.registers.load.directLoad * BASE_VOLUME;
	}

	/** Updates the sample. */
	clock() {
		// TODO: DO SOMETHING?
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
