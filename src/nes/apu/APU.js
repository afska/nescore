import { APURegisterSegment } from "./registers";
import { WithContext } from "../helpers";

/** The Audio Processing Unit. It generates audio samples. */
export default class APU {
	constructor() {
		WithContext.apply(this);

		this.registers = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.registers = new APURegisterSegment(context);

		this._reset();

		// TODO: REMOVE
		this.cycle = 0;
		this.count = 0;
	}

	/**
	 * Executes the next step (1 step = 1 PPU cycle = 0.16 APU cycles).
	 * It calls `onAudioSample` when it successfully generates a new sample.
	 */
	step(onAudioSample) {
		// TODO: IMPLEMENT

		// 5369318 steps per second
		// 5369318 / 44100 = 121.75 (generate a sample every 121 cycles)

		this.cycle++;
		if (this.cycle >= 121) {
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

	_reset() {}
}
