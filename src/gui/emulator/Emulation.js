import NES from "../../nes";
import FrameTimer from "./FrameTimer";
import Speaker from "./Speaker";
import config from "../../nes/config";

const PRESS_KEY_TO_ENABLE_AUDIO = "Press any key to enable audio!";

/**
 * An emulator runner instance.
 */
export default class Emulation {
	constructor(
		bytes,
		screen,
		getInput = () => [{}, {}],
		onFps = () => {},
		onError = () => {},
		onSaveState = () => {},
		saveState = null
	) {
		this.screen = screen;
		this.samples = [];

		this.speaker = new Speaker(({ need, have }) => {
			if (this._canSyncToAudio()) {
				const target = config.AUDIO_BUFFER_SIZE / 2;

				let n = need;
				if (have > target + config.AUDIO_DRIFT_THRESHOLD) n--;
				else if (have < target - config.AUDIO_DRIFT_THRESHOLD) n++;

				this.nes.samples(n);
				this._updateSound();
			}
		});
		this.speaker.start();
		if (this.speaker.state === "suspended") alert(PRESS_KEY_TO_ENABLE_AUDIO);

		this.saveState = saveState;
		this.isSaveStateRequested = false;
		this.isLoadStateRequested = false;
		this.wasSaveStateRequested = false;
		this.wasLoadStateRequested = false;
		this.isDebugging = false;
		this.isDebugStepFrameRequested = false;
		this.isDebugStepScanlineRequested = false;

		this.nes = new NES(this._onFrame, this._onAudio);
		this.frameTimer = new FrameTimer(() => {
			this._updateInput(getInput());

			if (
				this.isDebugging &&
				!this.isDebugStepFrameRequested &&
				!this.isDebugStepScanlineRequested
			)
				return;

			const isDebugStepScanlineRequested = this.isDebugStepScanlineRequested;
			this.isDebugStepFrameRequested = false;
			this.isDebugStepScanlineRequested = false;

			if (this.isSaveStateRequested && !this.wasSaveStateRequested) {
				this.saveState = this.nes.getSaveState();
				this.wasSaveStateRequested = true;

				onSaveState(this.saveState);
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
				if (!this._canSyncToAudio()) {
					if (isDebugStepScanlineRequested) {
						this.nes.scanline(true);
					} else {
						this.nes.frame();
					}
					this._updateSound();
				}
			} catch (error) {
				onError(error);
			}
		}, onFps);

		try {
			this.nes.load(bytes);
			this.frameTimer.start();
		} catch (error) {
			onError(error);
		}
	}

	terminate = () => {
		this.frameTimer.stop();
		this.speaker.stop();
	};

	_onFrame = (frameBuffer) => {
		this.frameTimer.countNewFrame();
		this.screen.setBuffer(frameBuffer);
	};

	_onAudio = (sample) => {
		this.samples.push(sample);
	};

	_updateSound() {
		this.speaker.writeSamples(this.samples);
		this.samples = [];
	}

	_updateInput(input) {
		for (let i = 0; i < 2; i++) {
			if (i === 0) {
				this.isSaveStateRequested = input[i].$saveState;
				this.isLoadStateRequested = input[i].$loadState;
				if (!input[i].$saveState) this.wasSaveStateRequested = false;
				if (!input[i].$loadState) this.wasLoadStateRequested = false;
				if (input[i].$startDebugging) this.isDebugging = true;
				if (input[i].$stopDebugging) this.isDebugging = false;
				if (input[i].$debugStepFrame) this.isDebugStepFrameRequested = true;
				if (input[i].$debugStepScanline)
					this.isDebugStepScanlineRequested = true;
			}

			for (let button in input[i])
				if (button[0] !== "$")
					this.nes.setButton(i + 1, button, input[i][button]);
		}
	}

	_canSyncToAudio() {
		return config.SYNC_TO_AUDIO && !this.isDebugging;
	}
}
