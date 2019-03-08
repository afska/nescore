import React, { Component } from "react";
import nes from "./assets/images/nes.png";
import "./App.css";

export default class App extends Component {
	render() {
		return (
			<div className="app">
				<div className="debugger">
					<pre id="expected" className="log" />
					<pre id="actual" className="log" />
				</div>
			</div>
		);
	}
}
