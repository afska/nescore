import React, { Component } from "react";
import DiffViewer from "react-diff-viewer";
import _ from "lodash";
import "./App.css";

export default class App extends Component {
	componentWillMount() {
		document.addEventListener("keydown", this.onStep);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.onStep);
	}

	state = { expected: "", actual: "" };

	render() {
		return (
			<div className="app">
				<div className="debugger" onKeyDown={this.onStep}>
					<DiffViewer
						oldValue={this.state.expected}
						newValue={this.state.actual}
						splitView={true}
					/>
				</div>
			</div>
		);
	}

	onStep = () => {
		let diffs = [];
		for (let i = 0; i < 15; i++) diffs.push(window.getDiff());

		this.setState({
			expected: _(diffs)
				.map("expected")
				.join("\n"),
			actual: _(diffs)
				.map("actual")
				.join("\n")
		});
	};
}
