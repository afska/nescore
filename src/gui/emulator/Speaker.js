import audioWorklet from "./audioWorklet?worker&url";
import constants from "../../nes/constants";

const WORKLET_NAME = "player-worklet";
const WEBAUDIO_BUFFER_SIZE = 1024;
const CHANNELS = 1;

export default class Speaker {
	async start() {
		if (this._audioCtx) return;
		if (!window.AudioContext) return;

		this.bufferSize = 0;

		this._audioCtx = new window.AudioContext({
			sampleRate: constants.APU_SAMPLE_RATE
		});

		await this._audioCtx.audioWorklet.addModule(audioWorklet);
		if (this._audioCtx == null) {
			this.stop();
			return;
		}

		this.playerWorklet = new AudioWorkletNode(this._audioCtx, WORKLET_NAME, {
			outputChannelCount: [CHANNELS],
			processorOptions: {
				bufferSize: WEBAUDIO_BUFFER_SIZE
			}
		});
		this.playerWorklet.connect(this._audioCtx.destination);
		this.playerWorklet.port.onmessage = (event) => {
			this.bufferSize = event.data;
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

		if (this._audioCtx) {
			this._audioCtx.close().catch(console.error);
			this._audioCtx = null;
		}
	}
}
