import React, { Component } from "react";
import { Buffer } from "buffer";
import Screen from "./Screen";
import FrameTimer from "./FrameTimer";
import NES from "../../nes";
import NESTestLogger from "../../nes/loggers/NESTestLogger";

export default class Emulator extends Component {
	constructor(props) {
		super(props);
	}

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

	frame() {
		try {
			const buffer = this.nes.frame();
			// TODO: WRITE BUFFER
		} catch (e) {
			this._onError(e);
		}
	}

	componentWillUnmount() {
		this.stop();
	}

	_initialize(screen) {
		const { rom, onLog } = this.props;
		if (!rom) return;
		const bytes = Buffer.from(rom);

		this.stop();

		const logger = new NESTestLogger();
		this.screen = screen;
		this.nes = new NES(logger);
		this.frameTimer = new FrameTimer(() => {
			this.frame();
			onLog(logger.lastLog);
		});

		try {
			this.nes.load(bytes);
		} catch (e) {
			this._onError(e);
		}
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
