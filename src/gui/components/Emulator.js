import React, { Component } from "react";
import Screen from "./Screen";
import FrameTimer from "../emulator/FrameTimer";
import NES from "../../nes";
import gamepad from "../emulator/gamepad";
import MyWorker from "worker-loader!../emulator/worker";
// import debug from "../emulator/debug"; // DEBUG

window.worker = new MyWorker();

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
		window.worker.postMessage("frame");

		// try {
		// 	// // if (!debugStep) gamepad.updateInput(this);
		// 	// if (this.isDebugging && !debugStep) return;
		// 	// const frameBuffer = this.nes.frame();
		// 	// this.screen.setBuffer(frameBuffer);
		// } catch (e) {
		// 	this._onError(e);
		// }
	};

	componentWillUnmount() {
		this.stop();

		this.screen = null;
		this.frameTimer = null;
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

		if (window.worker) {
			window.worker.terminate();
			window.worker = new MyWorker();
		}

		window.worker.onmessage = ({ data }) => {
			this.screen.setBuffer(data);
		};

		try {
			window.worker.postMessage(bytes);
		} catch (e) {
			this._onError(e);
		}

		// window.debug = debug(this); // DEBUG
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
