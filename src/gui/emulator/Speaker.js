import RingBuffer from "ringbufferjs";

const BUFFER_SIZE = 8192;
const DEFAULT_SAMPLE_RATE = 44100;

export default class Speaker {
	constructor() {
		this._bufferSize = BUFFER_SIZE;
		this._buffer = new RingBuffer(this._bufferSize);
	}

	start() {
		if (this._audioCtx) return;
		if (!window.AudioContext) return;

		this._audioCtx = new window.AudioContext();
		this._scriptNode = this._audioCtx.createScriptProcessor(1024, 0, 2);

		this._scriptNode.onaudioprocess = this._onAudioProcess;
	}

	getSampleRate() {
		if (!window.AudioContext) return DEFAULT_SAMPLE_RATE;

		const context = new window.AudioContext();
		const sampleRate = context.sampleRate;
		context.close();

		return sampleRate;
	}

	writeSample = (sample) => {
		if (this._buffer.size() >= this._bufferSize) {
			// buffer overrun
			this._buffer.deqN(this._bufferSize);
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

		try {
			const samples = this._buffer.deqN(size);

			for (let i = 0; i < size; i++) {
				left[i] = samples[i];
				right[i] = samples[i];
			}
		} catch (e) {
			// buffer underrun (needed {size}, got {this._buffer.size()})
			// ignore empty buffers... assume audio has just stopped

			for (let i = 0; i < size; i++) {
				left[i] = 0;
				right[i] = 0;
			}
		}
	};
}
