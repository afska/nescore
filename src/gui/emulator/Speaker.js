import audioWorklet from "./audioWorklet?worker&url";
import constants from "../../nes/constants";

const WORKLET_NAME = "player-worklet";
const WEBAUDIO_BUFFER_SIZE = 1024;
const CHANNELS = 1;
const FADE_DURATION = 0.05; // seconds

export default class Speaker {
	async start() {
		if (this._audioCtx) return;
		if (!window.AudioContext) return;

		this.bufferSize = 0;
		this._audioCtx = new window.AudioContext({
			sampleRate: constants.APU_SAMPLE_RATE
		});

		await this._audioCtx.audioWorklet.addModule(audioWorklet);
		if (!this._audioCtx) {
			this.stop();
			return;
		}

		// create gain node at 0
		this.gainNode = this._audioCtx.createGain();
		this.gainNode.gain.setValueAtTime(0, this._audioCtx.currentTime);

		this.playerWorklet = new AudioWorkletNode(this._audioCtx, WORKLET_NAME, {
			outputChannelCount: [CHANNELS],
			processorOptions: { bufferSize: WEBAUDIO_BUFFER_SIZE }
		});

		// worklet -> gain -> destination
		this.playerWorklet.connect(this.gainNode);
		this.gainNode.connect(this._audioCtx.destination);

		this._fadedIn = false;
		this.playerWorklet.port.onmessage = (event) => {
			this.bufferSize = event.data;
			if (!this._fadedIn && this.bufferSize >= WEBAUDIO_BUFFER_SIZE) {
				const now = this._audioCtx.currentTime;
				this.gainNode.gain.cancelScheduledValues(now);
				this.gainNode.gain.setValueAtTime(0, now);
				this.gainNode.gain.linearRampToValueAtTime(1, now + FADE_DURATION);
				this._fadedIn = true;
			}
		};
	}

	get state() {
		return this._audioCtx?.state ?? "off";
	}

	resume() {
		return this._audioCtx?.resume();
	}

	writeSamples = (samples) => {
		if (!this.playerWorklet) return;

		this.playerWorklet.port.postMessage(samples);
	};

	stop() {
		if (this.playerWorklet) {
			this.playerWorklet.port.close();
			this.playerWorklet.disconnect();
			this.playerWorklet = null;
		}
		if (this.gainNode) {
			this.gainNode.disconnect();
			this.gainNode = null;
		}
		if (this._audioCtx) {
			this._audioCtx.close().catch(console.error);
			this._audioCtx = null;
		}
		this._fadedIn = false;
	}
}
