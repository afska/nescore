/** A frequency sweeper. It can progressively increase or decrease pulse channels' notes. */
export default class FrequencySweeper {
	constructor() {
		// input
		this.startFlag = false;

		// output
		this.dividerCount = 0;
	}

	/** Clocks the sweeper and returns an updated frequency. */
	clock(period) {}
}
