import constants from "../../constants";

/** A frequency sweeper. It can progressively increase or decrease pulse channels' notes. */
export default class FrequencySweeper {
	constructor() {
		// input
		this.startFlag = false;

		// output
		this.dividerCount = 0;
		this.change = 0;
		this.mute = 0;
	}

	/** Sets up the `change` and `mute` values. */
	track(channel) {
		const register = channel.registers.sweep;
		this._setMute(channel);

		if (register.enabledFlag)
			this.change = channel.timer >> register.shiftCount;
	}

	/** Clocks the sweeper and updates channel's timer frequency. */
	clock(channel) {
		const register = channel.registers.sweep;
		if (!register.enabledFlag) return;

		/**
		 * The sweep unit continuously calculates each channel's target period in this way:
		 * - A barrel shifter shifts the channel's 11-bit raw timer period right by the shift count, producing the change amount.
		 * - If the negate flag is true, the change amount is made negative.
		 * - The target period is the sum of the current period and the change amount.
		 */

		if (this.dividerCount === 0 && register.shiftCount > 0 && !this.mute)
			channel.timer += this.change * (register.negateFlag ? -1 : 1);

		if (this.dividerCount === 0 || this.startFlag) {
			this.dividerCount = register.dividerPeriodMinusOne + 1;
			this.startFlag = false;
		} else this.dividerCount--;

		this._setMute(channel);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			startFlag: this.startFlag,
			dividerCount: this.dividerCount,
			change: this.change,
			mute: this.mute
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.startFlag = saveState.startFlag;
		this.dividerCount = saveState.dividerCount;
		this.change = saveState.change;
		this.mute = saveState.mute;
	}

	_setMute(channel) {
		this.mute =
			channel.timer < constants.APU_MIN_TIMER ||
			channel.timer > constants.APU_MAX_TIMER;
	}
}
