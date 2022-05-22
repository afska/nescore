import constants from "../../constants";

/** A volume envelope. It starts at a volume of 15 and decrements every time the unit is clocked. */
export default class Envelope {
	constructor() {
		// input
		this.startFlag = false;
		this.period = 0;

		// output
		this.dividerCount = 0;
		this.volume = 0;
	}

	/** Decrements `volume` every `period` clocks. If `loop`, it resets the countdown to 15. */
	clock(loop) {
		if (!this.startFlag) {
			if (this.dividerCount === 0) {
				this.dividerCount = this.period;

				if (this.volume === 0) {
					if (loop) this.volume = constants.APU_MAX_VOLUME;
				} else {
					this.volume--;
				}
			} else {
				this.dividerCount--;
			}
		} else {
			this.startFlag = false;
			this.volume = constants.APU_MAX_VOLUME;
			this.dividerCount = this.period;
		}
	}
}
