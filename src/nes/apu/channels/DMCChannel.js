import { WithContext } from "../../helpers";

const BASE_VOLUME = 0.01;

/**
 * The delta modulation channel (DMC) can output 1-bit delta-encoded samples (DPCM) or can
 * have its 7-bit counter directly loaded (PCM). This allows flexible manual sample playback.
 *
 * DPCM samples are stored as a stream of 1-bit deltas that control the 7-bit PCM counter that
 * the channel outputs. A bit of 1 will increment the counter, 0 will decrement, and it will clamp
 * rather than overflow if the 7-bit range is exceeded.
 */
export default class DMCChannel {
	constructor() {
		WithContext.apply(this);
	}

	/** Generates a new sample. */
	sample() {
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
