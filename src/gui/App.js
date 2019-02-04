import React, { Component } from "react";
import nes from "./assets/images/nes.png";
import "./App.css";

export default class App extends Component {
	render() {
		return (
			<div className="app">
				<header className="app-header">
					<img src={nes} className="app-logo" alt="logo" />
				</header>
			</div>
		);
	}
}
