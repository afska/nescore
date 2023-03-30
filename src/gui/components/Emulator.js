import React, { Component } from "react";
import Screen from "./CRTScreen";
import gamepad from "../emulator/gamepad";
import Speaker from "../emulator/Speaker";
import WebWorker from "../emulator/WebWorker";
import debug from "../emulator/debug";
import config from "../../nes/config";

const NEW_WEB_WORKER = () =>
	new Worker(new URL("../emulator/webWorkerRunner.js", import.meta.url));

const DEBUG_MODE = window.location.search === "?debug";
const SAVESTATE_KEY = "nescore-savestate";
const KEY_MAP = {
	" ": "BUTTON_A",
	d: "BUTTON_B",
	Delete: "BUTTON_SELECT",
	Enter: "BUTTON_START",
	ArrowUp: "BUTTON_UP",
	ArrowDown: "BUTTON_DOWN",
	ArrowLeft: "BUTTON_LEFT",
	ArrowRight: "BUTTON_RIGHT",
	"-": "$loadState",
	"+": "$saveState"
};

let webWorker = null;

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

		webWorker.postMessage([...input, this.speaker.bufferSize]);
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
			this.speaker.writeSamples(data);
		} else if (data?.id === "fps") {
			// fps report
			this.setFps(data.fps);
		} else if (data?.id === "saveState") {
			// save state
			this._setSaveState(data.saveState);
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
			: NEW_WEB_WORKER();

		if (DEBUG_MODE) window.debug = debug(this, webWorker);

		webWorker.onmessage = this.onWorkerMessage;
		webWorker.postMessage(bytes);
		webWorker.postMessage({
			id: "saveState",
			saveState: this._getSaveState()
		});

		this.keyboardInput = [gamepad.createInput(), gamepad.createInput()];
		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);
	}

	_getSaveState() {
		try {
			return JSON.parse(localStorage.getItem(SAVESTATE_KEY));
		} catch (e) {
			return null;
		}
	}

	_setSaveState(saveState) {
		localStorage.setItem(SAVESTATE_KEY, JSON.stringify(saveState));
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
