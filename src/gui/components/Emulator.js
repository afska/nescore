import React, { Component } from "react";
import Screen from "./Screen";
import FrameTimer from "../emulator/FrameTimer";
import gamepad from "../emulator/gamepad";
import WebWorker from "worker-loader!../emulator/webWorker";

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

	start() {
		if (this.frameTimer) this.frameTimer.start();
	}

	stop() {
		if (this.frameTimer) this.frameTimer.stop();
		if (webWorker) {
			webWorker.terminate();
			webWorker = null;
		}
		this.isWaiting = false;
		this.setFps(0);
	}

	frame = (debugStep = false) => {
		if (this.isWaiting) return;

		const input = !debugStep ? gamepad.getInput(this) : [{}, {}];
		if (this.isDebugging && !debugStep) return;
		webWorker.postMessage(input);
		this.isWaiting = true;
	};

	setFps = (fps) => {
		document.querySelector("#fps").textContent = `(fps: ${fps})`;
	};

	componentWillUnmount() {
		this.stop();
	}

	_initialize(screen) {
		const { rom } = this.props;
		if (!rom) return;
		const bytes = new Uint8Array(rom);

		this.stop();

		this.screen = screen;
		this.frameTimer = new FrameTimer(this.frame, this.setFps);

		webWorker = new WebWorker();
		webWorker.postMessage(bytes);
		webWorker.onmessage = ({ data }) => {
			if (data instanceof Uint32Array) {
				// frame data
				this.screen.setBuffer(data);
				this.isWaiting = false;
			} else if (data?.id === "error") {
				// error
				this._onError(data.error);
			}
		};
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
