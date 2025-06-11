import config from "../../config";

const DUTY_SEQUENCE = [
	[0, 1, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 1, 0, 0, 0],
	[1, 0, 0, 1, 1, 1, 1, 1]
];

/** A square wave generator. */
export default class PulseOscillator {
	constructor() {
		this.volume = 1;
		this.dutyCycle = 0;

		this._frequency = 0;
	}

	/** Generates a new sample. */
	sample(time) {
		const period = 1 / this._frequency;
		const phase = time % period;
		const step = Math.floor(phase / (period / 8));

		return (
			DUTY_SEQUENCE[this.dutyCycle][step] *
			this.volume *
			config.PULSE_CHANNEL_VOLUME
		);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			volume: this.volume,
			dutyCycle: this.dutyCycle,
			frequency: this._frequency
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.volume = saveState.volume;
		this.dutyCycle = saveState.dutyCycle;
		this.frequency = saveState.frequency;
	}

	/** Sets the frequency, but only if the change is above a minimum threshold (this sounds better). */
	set frequency(value) {
		if (Math.abs(this._frequency - value) > config.MIN_FREQUENCY_CHANGE)
			this._frequency = value;
	}
}
