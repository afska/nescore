import React, { Component } from "react";
import Screen from "./Screen";
import gamepad from "../emulator/gamepad";
import Speaker from "../emulator/Speaker";
import WebWorker from "../emulator/WebWorker";
import WebWorkerRunner from "worker-loader!../emulator/webWorkerRunner";
import debug from "../emulator/debug";
import config from "../../nes/config";

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
		webWorker.postMessage([...gamepad.getInput(), this.speaker.buffer.size()]);
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
		this.stateInterval = setInterval(
			this.sendState,
			config.STATE_POLL_INTERVAL
		);
		this.speaker = new Speaker();
		this.speaker.start();

		const bytes = new Uint8Array(rom);

		// (web workers are hard to debug, a mock is used in development mode)
		webWorker = config.DEBUG
			? new WebWorker(
					(data) => this.onWorkerMessage({ data }),
					this.speaker.writeSample,
					this.speaker
			  )
			: new WebWorkerRunner();

		if (config.DEBUG) window.debug = debug(this, webWorker);

		webWorker.postMessage({
			id: "sampleRate",
			sampleRate: this.speaker.getSampleRate()
		});
		webWorker.postMessage(bytes);
		webWorker.onmessage = this.onWorkerMessage;
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
