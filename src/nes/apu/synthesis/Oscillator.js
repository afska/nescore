export default class Oscillator {
	constructor() {
		this.amplitude = 1;
		this.harmonics = 1;
		this.dutyCycle = 0;
		this.frequency = 0;
	}

	sample(time) {
		let y1 = 0;
		let y2 = 0;

		const pi2 = Math.PI * 2;

		for (let n = 1; n <= this.harmonics; n++) {
			y1 += Math.sin(pi2 * this.frequency * time * n) / n;
			y2 += Math.sin(pi2 * (this.frequency * time - this.dutyCycle) * n) / n;
		}

		return (y1 - y2) * this.amplitude;
	}
}
