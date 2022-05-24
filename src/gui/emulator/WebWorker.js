import NES from "../../nes";
import FrameTimer from "./FrameTimer";

const SYNC_TO_AUDIO = true;
const BUFFER_LIMIT = 4096;
const SAMPLE_RATE = 44100;
const FPS = 60.098;

/**
 * An emulator instance running inside a Web Worker.
 * This contains the communication logic between `Emulator` and `webWorkerRunner`.
 */
export default class WebWorker {
	constructor(postMessage) {
		this.$postMessage = postMessage;

		this.isDebugging = false;
		this.isDebugStepRequested = false;

		this.availableSamples = 0;
		this.samples = [];

		this.nes = new NES(this.onFrame, this.onAudio);
		this.frameTimer = new FrameTimer(
			() => {
				if (this.isDebugging && !this.isDebugStepRequested) return;
				this.isDebugStepRequested = false;

				try {
					if (SYNC_TO_AUDIO) {
						const requestedSamples = SAMPLE_RATE / FPS;
						if (this.availableSamples + requestedSamples <= BUFFER_LIMIT)
							this.nes.samples(requestedSamples);
					} else {
						this.nes.frame();
					}

					this.$postMessage(this.samples);
					this.samples = [];
				} catch (error) {
					this.$postMessage({ id: "error", error });
				}
			},
			(fps) => {
				this.$postMessage({ id: "fps", fps });
			}
		);
	}

	onFrame = (frameBuffer) => {
		this.frameTimer.countNewFrame();
		this.$postMessage(frameBuffer);
	};

	onAudio = (sample) => {
		this.samples.push(sample);
	};

	terminate = () => {
		this.frameTimer.stop();
	};

	postMessage = (data) => {
		this.$onMessage({ data });
	};

	$onMessage = ({ data }) => {
		try {
			if (data instanceof Uint8Array) {
				// rom bytes
				this.nes.load(data);
				this.frameTimer.start();
			} else if (Array.isArray(data)) {
				// state packet

				// controller input
				for (let i = 0; i < 2; i++) {
					if (i === 0) {
						if (data[i].$startDebugging) this.isDebugging = true;
						if (data[i].$stopDebugging) this.isDebugging = false;
						if (data[i].$debugStep) this.isDebugStepRequested = true;
					}

					for (let button in data[i])
						if (button[0] !== "$")
							this.nes.setButton(i + 1, button, data[i][button]);
				}

				// available samples
				this.availableSamples = data[2];
			}
		} catch (error) {
			this.$postMessage({ id: "error", error });
		}
	};
}
