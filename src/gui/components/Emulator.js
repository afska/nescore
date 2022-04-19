import React, { Component } from "react";
import { Buffer } from "buffer";
import Screen from "./Screen";
import FrameTimer from "./FrameTimer";
import NES from "../../nes";

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

	componentWillUpdate() {
		this.stop();
	}

	start() {
		this.frameTimer.start();
	}

	stop() {
		this.frameTimer.stop();
	}

	frame() {
		try {
			const buffer = this.nes.frame();
			// TODO: WRITE BUFFER
		} catch (e) {
			debugger;
			this.props.onError(e);
		}
	}

	componentWillUnmount() {
		this.stop();
	}

	_initialize(screen) {
		const { rom, onError } = this.props;
		if (!rom) return;
		const bytes = Buffer.from(rom);

		this.screen = screen;
		this.nes = new NES();
		this.frameTimer = new FrameTimer(() => {
			this.frame();
		});

		try {
			this.nes.loadROM(bytes);
		} catch (e) {
			debugger;
			onError(e);
		}
	}
}
