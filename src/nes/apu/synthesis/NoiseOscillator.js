const BASE_AMPLITUDE = 0.25;

/** A noise random wave generator. */
export default class TriangleOscillator {
	constructor() {
		this.amplitude = 1;
	}

	/** Generates a new sample. */
	sample() {
		return (Math.random() * 2 - 1) * BASE_AMPLITUDE * this.amplitude;
	}
}
