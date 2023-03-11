import NES from "../../nes";
import FrameTimer from "./FrameTimer";
import config from "../../nes/config";
import constants from "../../nes/constants";

/**
 * An emulator instance running inside a Web Worker.
 * This contains the communication logic between `Emulator` and `webWorkerRunner`.
 */
export default class WebWorker {
	constructor(postMessage) {
		this.$postMessage = postMessage;

		this.saveState = null;
		this.isSaveStateRequested = false;
		this.isLoadStateRequested = false;
		this.isDebugging = false;
		this.isDebugStepFrameRequested = false;
		this.isDebugStepScanlineRequested = false;

		this.availableSamples = 0;
		this.samples = [];

		this.nes = new NES(this.onFrame, this.onAudio);
		this.frameTimer = new FrameTimer(
			() => {
				if (
					this.isDebugging &&
					!this.isDebugStepFrameRequested &&
					!this.isDebugScanlineRequested
				)
					return;

				const isDebugScanlineRequested = this.isDebugScanlineRequested;
				this.isDebugStepFrameRequested = false;
				this.isDebugScanlineRequested = false;

				if (this.isSaveStateRequested) {
					this.saveState = this.nes.getSaveState();
					this.isSaveStateRequested = false;
				}
				if (this.isLoadStateRequested && this.saveState != null) {
					this.nes.setSaveState(this.saveState);
					this.isLoadStateRequested = false;
				}

				try {
					if (isDebugScanlineRequested) {
						this.nes.scanline();
					} else if (config.SYNC_TO_AUDIO) {
						const requestedSamples = constants.APU_SAMPLE_RATE / config.FPS;
						const newBufferSize = this.availableSamples + requestedSamples;
						if (newBufferSize <= config.AUDIO_BUFFER_LIMIT)
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

				// -> controller input
				for (let i = 0; i < 2; i++) {
					if (i === 0) {
						if (data[i].$saveState) this.isSaveStateRequested = true;
						if (data[i].$loadState) this.isLoadStateRequested = true;
						if (data[i].$startDebugging) this.isDebugging = true;
						if (data[i].$stopDebugging) this.isDebugging = false;
						if (data[i].$debugStepFrame) this.isDebugStepFrameRequested = true;
						if (data[i].$debugStepScanline)
							this.isDebugScanlineRequested = true;
					}

					for (let button in data[i])
						if (button[0] !== "$")
							this.nes.setButton(i + 1, button, data[i][button]);
				}

				// -> available samples
				this.availableSamples = data[2];
			}
		} catch (error) {
			this.$postMessage({ id: "error", error });
		}
	};
}
