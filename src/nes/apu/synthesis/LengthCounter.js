/** A note length counter. It can be clocked to decrease its value and notify when it finishes. */
export default class LengthCounter {
	constructor() {
		this.counter = 0;
	}

	/** Decreases the counter unless `isHalted`. Unless `isEnabled`, it resets the counter to 0. */
	clock(isEnabled, isHalted) {
		if (!isEnabled) this.counter = 0;
		else if (this.counter > 0 && !isHalted) this.counter--;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return { counter: this.counter };
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.counter = saveState.counter;
	}

	/** Returns whether it finished counting or not. */
	get didFinish() {
		return this.counter === 0;
	}
}
