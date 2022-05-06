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
	}

	frame = (debugStep = false) => {
		const input = !debugStep ? gamepad.getInput(this) : [{}, {}];
		if (this.isDebugging && !debugStep) return;
		webWorker.postMessage(input);
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
		this.frameTimer = new FrameTimer(this.frame, (fps) => {
			document.querySelector("#fps").textContent = `(fps: ${fps})`;
		});

		if (webWorker) webWorker.terminate();
		webWorker = new WebWorker();
		webWorker.postMessage(bytes);
		webWorker.onmessage = ({ data }) => {
			this.screen.setBuffer(data);
		};
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
