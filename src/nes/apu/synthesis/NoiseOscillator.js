import config from "../../config";

/** A noise random wave generator. */
export default class TriangleOscillator {
	constructor() {
		this.amplitude = 1;
	}

	/** Generates a new sample. */
	sample() {
		return (
			(Math.random() * 2 - 1) * config.NOISE_CHANNEL_VOLUME * this.amplitude
		);
	}
}
