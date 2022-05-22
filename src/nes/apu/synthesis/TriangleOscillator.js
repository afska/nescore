const AMPLITUDE = 0.15;
const HARMONICS = 10;

/** A triangle wave generator. */
export default class TriangleOscillator {
	constructor() {
		this.amplitude = AMPLITUDE;
		this.harmonics = HARMONICS;
		this.frequency = 0;
	}

	/** Generates a new sample. */
	sample(time) {
		let y = 0;

		const pi2 = Math.PI * 2;

		for (let i = 1; i <= this.harmonics; i++) {
			const n = 2 * i + 1;
			y +=
				Math.pow(-1, i) *
				Math.pow(n, -2) *
				_approxsin(pi2 * this.frequency * time * n);
		}

		return y * this.amplitude;
	}
}

function _approxsin(t) {
	let j = t * 0.15915;
	j = j - Math.floor(j);
	return 20.785 * j * (j - 0.5) * (j - 1);
}
