import React, { Component } from "react";
import Screen from "./Screen";
import gamepad from "../emulator/gamepad";
import WebWorker from "worker-loader!../emulator/webWorker";

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

	stop() {
		clearInterval(this.interval);
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
		this.interval = setInterval(this.sendInput, INPUT_POLL_INTERVAL);

		const bytes = new Uint8Array(rom);
		webWorker = new WebWorker();
		webWorker.postMessage(bytes);
		webWorker.onmessage = ({ data }) => {
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
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
