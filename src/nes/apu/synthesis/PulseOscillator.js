import config from "../../config";
import constants from "../../constants";

const APU_SAMPLE_RATE = 44100;

/** A pulse wave generator. */
export default class PulseOscillator {
	constructor() {
		this.volume = constants.APU_MAX_VOLUME;
		this.dutyCycle = 0; // (0~1)

		this.frequency = 0;
		this._phase = 0; // (0~1)
	}

	/** Generates a new sample. */
	sample(isNewSample) {
		if (isNewSample)
			this._phase = (this._phase + this.frequency / APU_SAMPLE_RATE) % 1;

		return (
			(this._phase < this.dutyCycle ? this.volume : 0) *
			config.PULSE_CHANNEL_VOLUME
		);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			volume: this.volume,
			dutyCycle: this.dutyCycle,
			frequency: this.frequency,
			phase: this._phase
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.volume = saveState.volume;
		this.dutyCycle = saveState.dutyCycle;
		this.frequency = saveState.frequency;
		this._phase = saveState.phase;
	}
}
