import config from "../../config";

/** A square wave generator. */
export default class PulseOscillator {
	constructor() {
		this.amplitude = 1;
		this.harmonics = config.PULSE_CHANNEL_HARMONICS;
		this.dutyCycle = 0;

		this._frequency = 0;
	}

	/** Generates a new sample. */
	sample(time) {
		const period = 1 / this._frequency;
		const phase = time % period;

		return (
			(phase < this.dutyCycle * period ? 1 : -1) *
			config.PULSE_CHANNEL_VOLUME *
			this.amplitude
		);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			amplitude: this.amplitude,
			harmonics: this.harmonics,
			dutyCycle: this.dutyCycle,
			frequency: this._frequency
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.amplitude = saveState.amplitude;
		this.harmonics = saveState.harmonics;
		this.dutyCycle = saveState.dutyCycle;
		this.frequency = saveState.frequency;
	}

	/** Sets the frequency, but only if `value` is above a minimum value. */
	set frequency(value) {
		if (Math.abs(this._frequency - value) > config.MIN_FREQUENCY_CHANGE)
			this._frequency = value;
	}
}
