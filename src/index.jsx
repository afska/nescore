import React from "react";
import { createRoot } from "react-dom/client";
import App from "./gui/App";
import "nes.css/css/nes.css";
import "./gui/index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

// Disable keyboard scrolling
window.addEventListener(
	"keydown",
	function(e) {
		if (
			["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(
				e.code
			) > -1
		) {
			e.preventDefault();
		}
	},
	false
);
