import config from "../../config";

const TRIANGLE_SEQUENCE = [
	15,
	14,
	13,
	12,
	11,
	10,
	9,
	8,
	7,
	6,
	5,
	4,
	3,
	2,
	1,
	0,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15
];

/** A triangle wave generator. */
export default class TriangleOscillator {
	constructor() {
		this.amplitude = 1;
		this._frequency = 0;
	}

	/** Generates a new sample. */
	sample(time) {
		const period = 1 / this._frequency;
		const phase = time % period;
		const step = Math.floor(phase / (period / 32));

		return TRIANGLE_SEQUENCE[step] * config.TRIANGLE_CHANNEL_VOLUME;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			amplitude: this.amplitude,
			frequency: this._frequency
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.amplitude = saveState.amplitude;
		this.frequency = saveState.frequency;
	}

	/** Sets the frequency, but only if the change is above a minimum threshold (this sounds better). */
	set frequency(value) {
		if (Math.abs(this._frequency - value) > config.MIN_FREQUENCY_CHANGE)
			this._frequency = value;
	}
}
