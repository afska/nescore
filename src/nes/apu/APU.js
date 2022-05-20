import { APURegisterSegment } from "./registers";
import { WithContext } from "../helpers";

/** The Audio Processing Unit. It generates audio samples. */
export default class APU {
	constructor() {
		WithContext.apply(this);

		this.registers = null;
		this.pendingCycles = 0;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = new APURegisterSegment(context);

		this._reset();

		// TODO: REMOVE
		this.cycle = 0;
		this.count = 0;
	}

	/** Executes the next operation (1 cycle). */
	step(onAudioSample) {
		// TODO: IMPLEMENT

		// 1789773 steps per second
		// 1789773 / 44100 = 40.58 (generate a sample every 40.58 cycles)

		this.cycle++;
		if (this.cycle >= 40) {
			this.cycle = 0;
			this.count++;
		}

		const volume = 0.15;

		if (this.cycle === 0) {
			const time = this.count / 44100;
			const sample = Math.sin(2 * Math.PI * 440 * time) * volume;
			onAudioSample(sample);
		}
	}

	_reset() {
		this.pendingCycles = 0;
	}
}
