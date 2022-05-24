import React, { Component } from "react";
import config from "../../nes/config";
import constants from "../../nes/constants";
import styles from "./Screen.module.css";

const FULL_ALPHA = 0xff000000;

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
		for (let y = 0; y < constants.SCREEN_HEIGHT; ++y) {
			for (let x = 0; x < constants.SCREEN_WIDTH; ++x) {
				const i = y * constants.SCREEN_WIDTH + x;

				// mask borders
				if (config.MASK_BORDERS) {
					if (
						x < constants.TILE_LENGTH ||
						x > constants.SCREEN_WIDTH - 1 - constants.TILE_LENGTH ||
						y < constants.TILE_LENGTH ||
						y > constants.SCREEN_HEIGHT - 1 - constants.TILE_LENGTH
					)
						buffer[i] = 0;
				}

				// convert pixel from NES BGR to canvas ABGR
				this.buf32[i] = FULL_ALPHA | buffer[i];
			}
		}

		this._writeBuffer();
	};

	_writeBuffer() {
		this.imageData.data.set(this.buf8);
		this.context.putImageData(this.imageData, 0, 0);
	}

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

		// set alpha
		for (let i = 0; i < this.buf32.length; ++i) this.buf32[i] = FULL_ALPHA;
	}
}
