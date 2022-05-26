import config from "../../config";

/** A triangle wave generator. */
export default class TriangleOscillator {
	constructor() {
		this.amplitude = 1;

		this.lut = [];
		this._generateLookUpTable();

		this._frequency = 0;
	}

	/** Generates a new sample. */
	sample(time) {
		let y = 0;

		const pi2 = Math.PI * 2;
		const { frequency, amplitude, lut } = this;

		for (let i = 1; i <= config.TRIANGLE_CHANNEL_HARMONICS; i++) {
			const n = 2 * i + 1;
			y += lut[i] * _approxsin(pi2 * frequency * time * n);
		}

		return y * config.TRIANGLE_CHANNEL_VOLUME * amplitude;
	}

	_generateLookUpTable() {
		for (let i = 1; i <= config.TRIANGLE_CHANNEL_HARMONICS; i++) {
			const n = 2 * i + 1;
			this.lut[i] = Math.pow(-1, i) * Math.pow(n, -2);
		}
	}

	/** Returns the frequency. */
	get frequency() {
		return this._frequency;
	}

	/** Sets the frequency, only if `value` is above a minimum value. */
	set frequency(value) {
		if (Math.abs(this._frequency - value) > config.MIN_FREQUENCY_CHANGE)
			this._frequency = value;
	}
}

function _approxsin(t) {
	let j = t * 0.15915;
	j = j - Math.floor(j);
	return 20.785 * j * (j - 0.5) * (j - 1);
}
