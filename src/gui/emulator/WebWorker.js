import NES from "../../nes";
import FrameTimer from "./FrameTimer";

/**
 * An emulator instance running inside a Web Worker.
 * This contains the communication logic between `Emulator` and `webWorkerRunner`.
 */
export default class WebWorker {
	// TODO: MOVE onAudio to message
	constructor(postMessage, onAudio) {
		this.$postMessage = postMessage;

		this._onAudio = onAudio;

		this.isDebugging = false;
		this.isDebugStepRequested = false;

		this.nes = new NES(this.onFrame, this.onAudio);
		this.frameTimer = new FrameTimer(
			() => {
				if (this.isDebugging && !this.isDebugStepRequested) return;
				this.isDebugStepRequested = false;

				try {
					this.nes.frame();
				} catch (error) {
					this.$postMessage({ id: "error", error });
				}
			},
			(fps) => {
				this.$postMessage({ id: "fps", fps });
			}
		);
	}

	// syncToAudio = (requestedSamples) => {
	// 	this.nes.samples(requestedSamples);
	// };

	onFrame = (frameBuffer) => {
		this.frameTimer.countNewFrame();
		this.$postMessage(frameBuffer);
	};

	onAudio = (sample) => {
		this._onAudio(sample);
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
			}
		} catch (error) {
			this.$postMessage({ id: "error", error });
		}
	};
}
