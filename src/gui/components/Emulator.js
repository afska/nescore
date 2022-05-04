import React, { Component } from "react";
import Screen from "./Screen";
import FrameTimer from "../emulator/FrameTimer";
import NES from "../../nes";
import gamepad from "../emulator/gamepad";
import debug from "../emulator/debug";

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

	frame(debugStep = false) {
		try {
			if (!debugStep) gamepad.updateInput(this);
			if (this.isDebugging && !debugStep) return;

			const frameBuffer = this.nes.frame();
			this.screen.setBuffer(frameBuffer);
		} catch (e) {
			this._onError(e);
		}
	}

	componentWillUnmount() {
		this.stop();
	}

	_initialize(screen) {
		const { rom } = this.props;
		if (!rom) return;
		const bytes = new Uint8Array(rom);

		this.stop();

		this.screen = screen;
		this.nes = new NES();

		window.bytes = bytes;
		window.NES = NES;
		window.nes = this.nes;
		window.emu = this;

		this.frameTimer = new FrameTimer(() => {
			this.frame();
		});

		try {
			this.nes.load(bytes);
		} catch (e) {
			this._onError(e);
		}

		// DEBUG
		window.debug = debug(this);
	}

	_onError(e) {
		this.props.onError(e);
		this.stop();
	}
}
