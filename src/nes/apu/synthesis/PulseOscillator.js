import config from "../../config";

/** A square wave generator. */
export default class PulseOscillator {
	constructor() {
		this.amplitude = 1;
		this.harmonics = config.PULSE_CHANNEL_HARMONICS;
		this.dutyCycle = 0;
		this.frequency = 0;
	}

	/** Generates a new sample. */
	sample(time) {
		let y1 = 0;
		let y2 = 0;

		const pi2 = Math.PI * 2;

		for (let n = 1; n <= this.harmonics; n++) {
			y1 += _approxsin(pi2 * this.frequency * time * n) / n;
			y2 += _approxsin(pi2 * (this.frequency * time - this.dutyCycle) * n) / n;
		}

		return (y1 - y2) * config.PULSE_CHANNEL_VOLUME * this.amplitude;
	}
}

function _approxsin(t) {
	let j = t * 0.15915;
	j = j - Math.floor(j);
	return 20.785 * j * (j - 0.5) * (j - 1);
}
