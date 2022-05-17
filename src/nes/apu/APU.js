import { WithContext } from "../helpers";

/** The Audio Processing Unit. It generates audio samples. */
export default class APU {
	constructor() {
		WithContext.apply(this);
	}

	/** When a context is loaded. */
	onLoad(context) {
		this._reset();
	}

	/** Executes the next operation (1 cycle). */
	step(onAudioSample) {
		// TODO: IMPLEMENT
	}

	_reset() {}
}
