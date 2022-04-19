import React, { Component } from "react";
/** DEBUG */
import NameTable from "../../nes/ppu/debug/NameTable";
import PatternTable from "../../nes/ppu/debug/PatternTable";
/** DEBUG */
import styles from "./Screen.module.css";

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const FULL_ALPHA = 0xff000000;

export default class Screen extends Component {
	constructor(props) {
		super(props);

		this.setBuffer = this.setBuffer.bind(this);

		/** DEBUG */
		let tile = 0;
		const frameBuffer = new Uint32Array(256 * 240);
		window.drawTile = () => {
			const id = tile;
			const startX = (tile * 8) % 256;
			const startY = Math.floor((tile * 8) / 256) * 8;
			console.log("DRAWING TILE", tile, startX, startY);

			const plot = (x, y, color) => {
				frameBuffer[y * 256 + x] = color;
			};
			new PatternTable()
				.loadContext(window.nes.context)
				.renderTile(id, startX, startY, plot);
			this.setBuffer(frameBuffer);

			tile++;
		};
		window.drawTiles = () => {
			try {
				while (true) window.drawTile();
			} catch (e) {}
		};
		/** DEBUG */
	}

	render() {
		return (
			<canvas
				className={styles.screen}
				width={SCREEN_WIDTH}
				height={SCREEN_HEIGHT}
				ref={(canvas) => {
					if (canvas) this._initCanvas(canvas);
				}}
			/>
		);
	}

	setBuffer(buffer) {
		for (let y = 0; y < SCREEN_HEIGHT; ++y) {
			for (let x = 0; x < SCREEN_WIDTH; ++x) {
				const i = y * 256 + x;
				// Convert pixel from NES BGR to canvas ABGR
				this.buf32[i] = FULL_ALPHA | buffer[i];
			}
		}

		this._writeBuffer();
	}

	_writeBuffer() {
		this.imageData.data.set(this.buf8);
		this.context.putImageData(this.imageData, 0, 0);
	}

	_initCanvas(canvas) {
		this.context = canvas.getContext("2d");
		this.imageData = this.context.getImageData(
			0,
			0,
			SCREEN_WIDTH,
			SCREEN_HEIGHT
		);

		// Set alpha to opaque
		this.context.fillStyle = "black";
		this.context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

		// Buffer to write on next animation frame
		this.buf = new ArrayBuffer(this.imageData.data.length);

		// Get the canvas buffer in 8bit and 32bit
		this.buf8 = new Uint8ClampedArray(this.buf);
		this.buf32 = new Uint32Array(this.buf);

		// Set alpha
		for (let i = 0; i < this.buf32.length; ++i) this.buf32[i] = FULL_ALPHA;
	}
}
