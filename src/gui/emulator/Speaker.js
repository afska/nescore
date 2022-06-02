import RingBuffer from "ringbufferjs";
import config from "../../nes/config";

const WEBAUDIO_BUFFER_SIZE = 1024;
const CHANNELS = 2;

export default class Speaker {
	constructor() {
		this.buffer = new RingBuffer(config.AUDIO_BUFFER_SIZE);
	}

	start() {
		if (this._audioCtx) return;
		if (!window.AudioContext) return;

		// HACK: createScriptProcessor is deprecated, but there's no easy replacement
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
		if (!window.AudioContext)
			throw new Error("Audio context is not supported.");

		const context = new window.AudioContext();
		const sampleRate = context.sampleRate;
		context.close();

		return sampleRate;
	}

	writeSample = (sample) => {
		if (this.buffer.size() >= config.AUDIO_BUFFER_SIZE) {
			// buffer overrun
			this.buffer.deqN(config.AUDIO_BUFFER_SIZE);
		}

		this.buffer.enq(sample);
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
			const samples = this.buffer.deqN(size);
			for (let i = 0; i < size; i++) left[i] = right[i] = samples[i];
		} catch (e) {
			// buffer underrun (needed {size}, got {this.buffer.size()})
			// ignore empty buffers... assume audio has just stopped
			for (let i = 0; i < size; i++) left[i] = right[i] = 0;
		}
	};
}
