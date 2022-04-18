import React, { Component } from "react";
import "./App.css";

export default class App extends Component {
	state = { expected: "", actual: "" };

	render() {
		return <div className="app">Hello world!</div>;
	}
}
