import React, { Component } from "react";
import Emulator from "./components/Emulator";
import TVNoise from "./components/TVNoise";
import classNames from "classnames";
import styles from "./App.module.css";
import _ from "lodash";

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
	}

	_loadRom(rom) {
		this.setState({ rom });
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
