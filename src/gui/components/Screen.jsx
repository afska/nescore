import React, { Component } from "react";
import constants from "../../nes/constants";
import styles from "./Screen.module.css";

export default class Screen extends Component {
	render() {
		return (
			<canvas
				className={styles.screen}
				width={constants.SCREEN_WIDTH}
				height={constants.SCREEN_HEIGHT}
				ref={(canvas) => {
					if (canvas) this._initCanvas(canvas);
				}}
			/>
		);
	}

	setBuffer = (buffer) => {
		this.buf32.set(buffer);
		this.imageData.data.set(this.buf8);
		this.context.putImageData(this.imageData, 0, 0);
	};

	_initCanvas(canvas) {
		this.context = canvas.getContext("2d");
		this.imageData = this.context.getImageData(
			0,
			0,
			constants.SCREEN_WIDTH,
			constants.SCREEN_HEIGHT
		);

		// set alpha to opaque
		this.context.fillStyle = "black";
		this.context.fillRect(
			0,
			0,
			constants.SCREEN_WIDTH,
			constants.SCREEN_HEIGHT
		);

		// buffer to write on next animation frame
		this.buf = new ArrayBuffer(this.imageData.data.length);

		// get the canvas buffer in 8bit and 32bit
		this.buf8 = new Uint8ClampedArray(this.buf);
		this.buf32 = new Uint32Array(this.buf);
	}
}
