const BASE_AMPLITUDE = 3;
const HARMONICS = 10;

/** A triangle wave generator. */
export default class TriangleOscillator {
	constructor() {
		this.amplitude = 1;
		this.frequency = 0;
		this.lut = [];
		this._generateLookUpTable();
	}

	/** Generates a new sample. */
	sample(time) {
		let y = 0;

		const pi2 = Math.PI * 2;

		for (let i = 1; i <= HARMONICS; i++) {
			const n = 2 * i + 1;
			y += this.lut[i] * _approxsin(pi2 * this.frequency * time * n);
		}

		return y * BASE_AMPLITUDE * this.amplitude;
	}

	_generateLookUpTable() {
		for (let i = 1; i <= HARMONICS; i++) {
			const n = 2 * i + 1;
			this.lut[i] = Math.pow(-1, i) * Math.pow(n, -2);
		}
	}
}

function _approxsin(t) {
	let j = t * 0.15915;
	j = j - Math.floor(j);
	return 20.785 * j * (j - 0.5) * (j - 1);
}
