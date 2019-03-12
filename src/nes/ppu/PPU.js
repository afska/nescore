import { WithContext } from "../helpers";

// TODO: Add docs
const TILE_SIZE_X = 8;
const TILE_SIZE_Y = 8;
const TILE_SIZE_BYTES = 16;

export default class PPU {
	constructor() {
		WithContext.apply(this);

		// TODO: Initialize
		this.tile = 0;
	}

	step() {
		const cartridge = this.context.cartridge;
		const chrRom = cartridge.chrRom;

		// render tile
		const start = this.tile * TILE_SIZE_BYTES;
		const firstPlane = chrRom.slice(start, start + TILE_SIZE_BYTES / 2);
		const secondPlane = chrRom.slice(
			start + TILE_SIZE_BYTES / 2,
			start + TILE_SIZE_BYTES
		);

		const pixels = [];
		for (let y = 0; y < TILE_SIZE_Y; y++) {
			const row1 = firstPlane[y];
			const row2 = secondPlane[y];

			for (let x = 0; x < TILE_SIZE_X; x++) {
				const column = TILE_SIZE_X - 1 - x;
				const lsb = (row1 >> column) & 1;
				const msb = (row2 >> column) & 1;
				pixels.push(lsb + msb * 2);
			}
		}

		const palette = ["#ffffff", "#cecece", "#686868", "#000000"];

		pixels.forEach((p, i) => {
			document.querySelector(`#p${i}`).style.backgroundColor = palette[p];
		});

		this.tile++;
		// TODO: Do it
	}
}
