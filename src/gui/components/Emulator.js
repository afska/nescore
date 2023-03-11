import React, { Component } from "react";
import Screen from "./Screen";
import gamepad from "../emulator/gamepad";
import Speaker from "../emulator/Speaker";
import WebWorker from "../emulator/WebWorker";
import WebWorkerRunner from "worker-loader!../emulator/webWorkerRunner";
import debug from "../emulator/debug";
import config from "../../nes/config";

const DEBUG_MODE = config.debug || window.location.search === "?debug";
let webWorker = null;

const KEY_MAP = {
	" ": "BUTTON_A",
	d: "BUTTON_B",
	Delete: "BUTTON_SELECT",
	Enter: "BUTTON_START",
	ArrowUp: "BUTTON_UP",
	ArrowDown: "BUTTON_DOWN",
	ArrowLeft: "BUTTON_LEFT",
	ArrowRight: "BUTTON_RIGHT",
	"1": "$loadState",
	"9": "$saveState"
};

export default class Emulator extends Component {
	render() {
		return (
			<Screen
				ref={(screen) => {
					if (screen) this._initialize(screen);
				}}
			/>
		);
	}

	sendState = () => {
		const gamepadInput = gamepad.getInput();
		const input = gamepadInput || this.keyboardInput;

		webWorker.postMessage([...input, this.speaker.buffer.size()]);
	};

	setFps = (fps) => {
		document.querySelector("#fps").textContent = `(fps: ${fps})`;
	};

	onWorkerMessage = ({ data }) => {
		if (data instanceof Uint32Array) {
			// frame data
			this.screen.setBuffer(data);
		} else if (Array.isArray(data)) {
			// audio samples
			for (let sample of data) this.speaker.writeSample(sample);
		} else if (data?.id === "fps") {
			// fps report
			this.setFps(data.fps);
		} else if (data?.id === "error") {
			// error
			this._onError(data.error);
		}
	};

	stop() {
		clearInterval(this.stateInterval);
		this.stateInterval = null;

		if (this.speaker) this.speaker.stop();
		this.speaker = null;

		if (webWorker) {
			webWorker.terminate();
			webWorker = null;
		}

		this.setFps(0);

		window.removeEventListener("keydown", this._onKeyDown);
		window.removeEventListener("keyup", this._onKeyUp);
	}

	componentWillUnmount() {
		this.stop();
	}

	_initialize(screen) {
		const { rom } = this.props;
		if (!rom) return;
		this.screen = screen;

		this.stop();
		this.stateInterval = setInterval(
			this.sendState,
			config.STATE_POLL_INTERVAL
		);
		this.speaker = new Speaker();
		this.speaker.start();

		const bytes = new Uint8Array(rom);

		// (web workers are hard to debug, a mock is used in development mode)
		webWorker = DEBUG_MODE
			? new WebWorker(
					(data) => this.onWorkerMessage({ data }),
					this.speaker.writeSample,
					this.speaker
			  )
			: new WebWorkerRunner();

		if (DEBUG_MODE) window.debug = debug(this, webWorker);

		webWorker.onmessage = this.onWorkerMessage;
		webWorker.postMessage({
			id: "sampleRate",
			sampleRate: this.speaker.getSampleRate()
		});
		webWorker.postMessage(bytes);

		this.keyboardInput = [gamepad.createInput(), gamepad.createInput()];
		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}

	_onKeyDown = (e) => {
		const button = KEY_MAP[e.key];
		if (!button) return;

		this.keyboardInput[0][button] = true;
	};

	_onKeyUp = (e) => {
		const button = KEY_MAP[e.key];
		if (!button) return;

		this.keyboardInput[0][button] = false;
	};
}
