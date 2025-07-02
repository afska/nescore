import React, { Component } from "react";
import Screen from "./Screen";
import gamepad from "../emulator/gamepad";
import debug from "../emulator/debug";
import Emulation from "../emulator/Emulation";

const SAVESTATE_KEY = "nescore-savestate";
const KEY_MAP = {
	" ": "BUTTON_A",
	d: "BUTTON_B",
	backspace: "BUTTON_SELECT",
	enter: "BUTTON_START",
	arrowup: "BUTTON_UP",
	arrowdown: "BUTTON_DOWN",
	arrowleft: "BUTTON_LEFT",
	arrowright: "BUTTON_RIGHT",
	o: "$loadState",
	p: "$saveState"
};

let emulation = null;

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

	componentWillUnmount() {
		this._stop();
	}

	_initialize(screen) {
		const { rom } = this.props;
		if (!rom) return;

		this._stop();

		this.keyboardInput = gamepad.createInput();
		window.addEventListener("keydown", this._onKeyDown);
		window.addEventListener("keyup", this._onKeyUp);

		const bytes = new Uint8Array(rom);
		const saveState = this._getSaveState();
		emulation = new Emulation(
			bytes,
			screen,
			this._getInput,
			this._setFps,
			this._setError,
			this._setSaveState,
			saveState
		);

		window.debug = debug(this, emulation);
	}

	_getInput = () => {
		const gamepadInput = gamepad.getInput();
		return gamepadInput?.[0] != null
			? [gamepadInput?.[0], gamepadInput?.[1] || this.keyboardInput]
			: [this.keyboardInput, gamepad.createInput()];
	};

	_setFps = (fps) => {
		document.querySelector("#fps").textContent = `(fps: ${fps})`;
	};

	_setError = (error) => {
		this.props.onError(error);
		this._stop();
	};

	_stop() {
		if (emulation) {
			emulation.terminate();
			emulation = null;
		}

		this._setFps(0);

		window.removeEventListener("keydown", this._onKeyDown);
		window.removeEventListener("keyup", this._onKeyUp);
	}

	_onKeyDown = (e) => {
		emulation?.speaker?.resume();

		const button = KEY_MAP[e.key?.toLowerCase()];
		if (!button) return;

		this.keyboardInput[button] = true;
	};

	_onKeyUp = (e) => {
		const button = KEY_MAP[e.key?.toLowerCase()];
		if (!button) return;

		this.keyboardInput[button] = false;
	};

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
}
