import LengthCounter from "./LengthCounter";

/** A length counter that postpones changes until the next quarter beat. */
export default class LinearLengthCounter extends LengthCounter {
	constructor() {
		super();

		this.reload = 0;
		this.reloadFlag = false;
	}

	/**
	 * Sets the counter with the reload value or clocks the length counter as normal.
	 * Unless `isHalted`, the reload flag is cleared.
	 */
	clock(isEnabled, isHalted) {
		if (!isEnabled) {
			this.counter = 0;
			return;
		}

		if (this.reloadFlag) this.counter = this.reload;
		else super.clock(isEnabled, isHalted);

		if (!isHalted) this.reloadFlag = false;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			...super.getSaveState(),
			reload: this.reload,
			reloadFlag: this.reloadFlag
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		super.setSaveState(saveState);

		this.reload = saveState.reload;
		this.reloadFlag = saveState.reloadFlag;
	}
}
