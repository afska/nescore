import React, { Component } from "react";
import Emulator from "./components/Emulator";
import TVNoise from "./components/TVNoise";
import classNames from "classnames";
import styles from "./App.module.css";

export default class App extends Component {
	state = { rom: null };

	render() {
		const { rom } = this.state;

		return (
			<div className={styles.app}>
				<h1>NesCore</h1>
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
							onStartPressed={this._onStartPressed}
							onError={this._onError}
							ref={(ref) => (this.emulator = ref)}
						/>
					) : (
						<TVNoise />
					)}
				</div>
			</div>
		);
	}
}
