import config from "../../config";

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
		const slope = (4 * this.amplitude) / period;
		const phaseInSlope = phase * slope;

		return (
			(phase <= period / 2
				? phaseInSlope - this.amplitude
				: 3 * this.amplitude - phaseInSlope) * config.TRIANGLE_CHANNEL_VOLUME
		);
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

	/** Sets the frequency, but only if `value` is above a minimum value. */
	set frequency(value) {
		if (Math.abs(this._frequency - value) > config.MIN_FREQUENCY_CHANGE)
			this._frequency = value;
	}
}
