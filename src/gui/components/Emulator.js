import React, { Component } from "react";
import Screen from "./Screen";
import gamepad from "../emulator/gamepad";
import Speaker from "../emulator/Speaker";
import WebWorker from "../emulator/WebWorker";
import debug from "../emulator/debug";

const NEW_WEB_WORKER = () =>
	new Worker(new URL("../emulator/webWorkerRunner.js", import.meta.url));

const DEBUG_MODE = window.location.search === "?debug";
const SAVESTATE_KEY = "nescore-savestate";
const KEY_MAP = {
	" ": "BUTTON_A",
	d: "BUTTON_B",
	Backspace: "BUTTON_SELECT",
	Enter: "BUTTON_START",
	ArrowUp: "BUTTON_UP",
	ArrowDown: "BUTTON_DOWN",
	ArrowLeft: "BUTTON_LEFT",
	ArrowRight: "BUTTON_RIGHT",
	o: "$loadState",
	p: "$saveState"
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
		const input =
			gamepadInput?.[0] != null
				? [gamepadInput?.[0], gamepadInput?.[1] || this.keyboardInput]
				: [this.keyboardInput, gamepad.createInput()];

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
			this.sendState();
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
		this.speaker = new Speaker();
		this.speaker.start();
		this.keyboardInput = gamepad.createInput();
		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);

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

		this.keyboardInput[button] = true;
	};

	_onKeyUp = (e) => {
		const button = KEY_MAP[e.key];
		if (!button) return;

		this.keyboardInput[button] = false;
	};
}
