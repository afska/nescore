import React, { Component } from "react";
import Screen from "./Screen";
import gamepad from "../emulator/gamepad";
import Speaker from "../emulator/Speaker";
import WebWorker from "../emulator/WebWorker";
import WebWorkerRunner from "worker-loader!../emulator/webWorkerRunner";
import debug from "../emulator/debug";

const DEBUG = true;
const INPUT_POLL_INTERVAL = 10;
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

	sendInput = () => {
		webWorker.postMessage(gamepad.getInput());
	};

	setFps = (fps) => {
		document.querySelector("#fps").textContent = `(fps: ${fps})`;
	};

	onWorkerMessage = ({ data }) => {
		if (data instanceof Uint32Array) {
			// frame data
			this.screen.setBuffer(data);
		} else if (data?.id === "fps") {
			// fps report
			this.setFps(data.fps);
		} else if (data?.id === "error") {
			// error
			this._onError(data.error);
		}
	};

	stop() {
		clearInterval(this.inputInterval);
		this.inputInterval = null;

		if (this.speaker) this.speaker.stop();
		this.speaker = null;

		if (webWorker) {
			webWorker.terminate();
			webWorker = null;
		}

		this.setFps(0);
	}

	componentWillUnmount() {
		this.stop();
	}

	_initialize(screen) {
		const { rom } = this.props;
		if (!rom) return;
		this.screen = screen;

		this.stop();
		this.inputInterval = setInterval(this.sendInput, INPUT_POLL_INTERVAL);
		this.speaker = new Speaker();
		this.speaker.start();

		const bytes = new Uint8Array(rom);

		// (web workers are hard to debug, a mock is used in development mode)
		webWorker = DEBUG
			? new WebWorker(
					(data) => this.onWorkerMessage({ data }),
					this.speaker.writeSample,
					this.speaker
			  )
			: new WebWorkerRunner();

		if (DEBUG) window.debug = debug(this, webWorker);

		webWorker.postMessage(bytes);
		webWorker.onmessage = this.onWorkerMessage;
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
