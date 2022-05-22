/** A wave generator. It uses sin wave addition to synthetize different types of signals. */
export default class Oscillator {
	constructor(amplitude = 1, harmonics = 1) {
		this.amplitude = amplitude;
		this.harmonics = harmonics;
		this.dutyCycle = 0;
		this.frequency = 0;
	}

	/** Generates a new sample. */
	sample(time) {
		let y1 = 0;
		let y2 = 0;

		const pi2 = Math.PI * 2;

		for (let n = 1; n <= this.harmonics; n++) {
			y1 += approxsin(pi2 * this.frequency * time * n) / n;
			y2 += approxsin(pi2 * (this.frequency * time - this.dutyCycle) * n) / n;
		}

		return (y1 - y2) * this.amplitude;
	}
}

/** A faster `Math.sin` that is close enough™ for audio. */
function approxsin(t) {
	let j = t * 0.15915;
	j = j - Math.floor(j);
	return 20.785 * j * (j - 0.5) * (j - 1);
}
