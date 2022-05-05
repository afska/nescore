import React, { Component } from "react";
import Emulator from "./components/Emulator";
import TVNoise from "./components/TVNoise";
import classNames from "classnames";
import styles from "./App.module.css";
import _ from "lodash";
import NES from "../nes";

export default class App extends Component {
	state = { rom: null };

	render() {
		const { rom } = this.state;

		return (
			<div className={styles.app}>
				<h6>(drag a NES ROM here)</h6>
				<br />

				<div
					className={classNames(
						styles.gameContainer,
						"nes-container",
						"is-dark",
						"with-title"
					)}
				>
					{rom ? (
						<Emulator
							rom={rom}
							onError={this._onError}
							ref={(ref) => (this.emulator = ref)}
						/>
					) : (
						<TVNoise />
					)}
				</div>

				<h6 id="fps">(fps: 0)</h6>
			</div>
		);
	}

	componentDidMount() {
		window.addEventListener("dragover", this._ignore);
		window.addEventListener("dragenter", this._ignore);
		window.addEventListener("drop", this._onFileDrop);
	}

	componentWillUnmount() {
		window.removeEventListener("dragover", this._ignore);
		window.removeEventListener("dragenter", this._ignore);
		window.removeEventListener("drop", this._onFileDrop);

		this.emulator = null;
	}

	_loadRom(rom) {
		let frames = 0;
		let fpsMarks = [];
		let runTime = 0;
		let secondTime = 0;

		const bytes = new Uint8Array(rom);

		const nes = new NES();
		nes.load(bytes);

		while (true) {
			if (window.stopNow) return;

			const t0 = performance.now();
			nes.frame();
			const t1 = performance.now();

			const elapsedMs = t1 - t0;
			frames++;
			runTime += elapsedMs;
			secondTime += elapsedMs;

			if (secondTime > 1000) {
				console.log(frames);
				fpsMarks.push(frames);
				secondTime = 0;
				frames = 0;
			}

			if (runTime > 5000) {
				console.log("AVERAGE:", _.mean(fpsMarks));
				console.log("RELOADING...");
				nes.load(bytes);
				runTime = 0;
				fpsMarks = [];
			}
		}
	}

	_onFileDrop = (e) => {
		e.preventDefault();

		const file = _.first(e.dataTransfer.files);
		const reader = new FileReader();
		if (!file) return;

		reader.onload = (event) => {
			const rom = event.target.result;
			this._loadRom(rom);
		};

		reader.readAsArrayBuffer(file);
	};

	_onError = (error) => {
		console.error(error);
		this.setState({ rom: null });
	};

	_ignore = (e) => {
		e.stopPropagation();
		e.preventDefault();
	};
}
