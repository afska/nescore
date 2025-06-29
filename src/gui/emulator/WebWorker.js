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
		this.wasSaveStateRequested = false;
		this.wasLoadStateRequested = false;
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
					!this.isDebugStepScanlineRequested
				) {
					this.$postMessage(this.samples);
					return;
				}

				const isDebugStepScanlineRequested = this.isDebugStepScanlineRequested;
				this.isDebugStepFrameRequested = false;
				this.isDebugStepScanlineRequested = false;

				if (this.isSaveStateRequested && !this.wasSaveStateRequested) {
					this.saveState = this.nes.getSaveState();
					this.wasSaveStateRequested = true;

					this.$postMessage({ id: "saveState", saveState: this.saveState });
				}
				if (
					this.isLoadStateRequested &&
					!this.wasLoadStateRequested &&
					this.saveState != null
				) {
					this.nes.setSaveState(this.saveState);
					this.wasLoadStateRequested = true;
				}

				try {
					if (isDebugStepScanlineRequested) {
						this.nes.scanline(true);
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
						this.isSaveStateRequested = data[i].$saveState;
						this.isLoadStateRequested = data[i].$loadState;
						if (!data[i].$saveState) this.wasSaveStateRequested = false;
						if (!data[i].$loadState) this.wasLoadStateRequested = false;
						if (data[i].$startDebugging) this.isDebugging = true;
						if (data[i].$stopDebugging) this.isDebugging = false;
						if (data[i].$debugStepFrame) this.isDebugStepFrameRequested = true;
						if (data[i].$debugStepScanline)
							this.isDebugStepScanlineRequested = true;
					}

					for (let button in data[i])
						if (button[0] !== "$")
							this.nes.setButton(i + 1, button, data[i][button]);
				}

				// -> available samples
				this.availableSamples = data[2];
			} else {
				// metadata
				if (data.id === "saveState") this.saveState = data.saveState;
			}
		} catch (error) {
			this.$postMessage({ id: "error", error });
		}
	};
}
