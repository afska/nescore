import React, { Component } from "react";
import Emulator from "./components/Emulator";
import "./App.css";

export default class App extends Component {
	state = { rom: null };

	render() {
		const { rom } = this.state;

		return (
			<div className="app">
				<h1>NesCore</h1>

				{/* {rom ? (
					<Emulator
						rom={rom}
						onStartPressed={this._onStartPressed}
						onError={this._onError}
						ref={(ref) => (this.emulator = ref)}
					/>
				) : (
					<TVNoise />
				)} */}
			</div>
		);
	}
}
