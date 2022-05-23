import RingBuffer from "ringbufferjs";

const BUFFER_SIZE = 8192;
const WEBAUDIO_BUFFER_SIZE = 1024;
const DEFAULT_SAMPLE_RATE = 44100;
const CHANNELS = 2;

export default class Speaker {
	constructor(onProcess = () => {}) {
		this._buffer = new RingBuffer(BUFFER_SIZE);
		this._onProcess = onProcess;
	}

	start() {
		if (this._audioCtx) return;
		if (!window.AudioContext) return;

		console.log("SAMPLE RATE", this.getSampleRate());
		// TODO: REMOVE

		this._audioCtx = new window.AudioContext();
		this._scriptNode = this._audioCtx.createScriptProcessor(
			WEBAUDIO_BUFFER_SIZE,
			0,
			CHANNELS
		);

		this._scriptNode.onaudioprocess = this._onAudioProcess;
		this._scriptNode.connect(this._audioCtx.destination);
	}

	getSampleRate() {
		if (!window.AudioContext) return DEFAULT_SAMPLE_RATE;

		const context = new window.AudioContext();
		const sampleRate = context.sampleRate;
		context.close();

		return sampleRate;
	}

	writeSample = (sample) => {
		if (this._buffer.size() >= BUFFER_SIZE) {
			// buffer overrun
			console.log("OVER"); // TODO: REMOVE
			this._buffer.deqN(BUFFER_SIZE);
		}

		this._buffer.enq(sample);
	};

	stop() {
		if (this._audioCtx) {
			this._audioCtx.close().catch(console.error);
			this._audioCtx = null;
		}

		if (this._scriptNode) {
			this._scriptNode.onaudioprocess = null;
			this._scriptNode = null;
		}
	}

	_onAudioProcess = (event) => {
		const left = event.outputBuffer.getChannelData(0);
		const right = event.outputBuffer.getChannelData(1);
		const size = left.length;

		this._onProcess(size);

		try {
			const samples = this._buffer.deqN(size);

			for (let i = 0; i < size; i++) {
				left[i] = right[i] = samples[i];
			}
		} catch (e) {
			// buffer underrun (needed {size}, got {this._buffer.size()})
			// ignore empty buffers... assume audio has just stopped

			console.log("UNDER"); // TODO: REMOVE
			for (let i = 0; i < size; i++) {
				left[i] = right[i] = 0;
			}
		}
	};
}
