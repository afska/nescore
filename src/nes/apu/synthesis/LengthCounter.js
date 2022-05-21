export default class LengthCounter {
	constructor() {
		this.counter = 0;
	}

	clock(isEnabled, isHalted) {
		if (!isEnabled) this.counter = 0;
		else if (this.counter > 0 && !isHalted) this.counter--;
	}

	get hasDone() {
		return this.counter === 0;
	}
}
