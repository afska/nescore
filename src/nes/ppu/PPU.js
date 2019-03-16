import { WithContext, Byte } from "../helpers";

// TODO: Add docs
const TILE_SIZE_X = 8;
const TILE_SIZE_Y = 8;
const TILE_SIZE_BYTES = 16;

/** The Picture Processing Unit. It generates a video signal of 256x240 pixels. */
export default class PPU {
	constructor() {
		WithContext.apply(this);

		this.frame = 0;
		this.scanLine = 0;
		this.cycle = 0;

		// TODO: Initialize
		this.tile = 0;
	}

	/** Executes the next operation. */
	step() {
		const cartridge = this.context.cartridge;
		const chrRom = cartridge.chrRom;

		// The pattern table is an area of memory connected to the PPU that defines the shapes of tiles that make up backgrounds and sprites. Each tile in the pattern table is 16 bytes, made of two planes. The first plane controls bit 0 of the color; the second plane controls bit 1. Any pixel whose color is 0 is background/transparent.

		// render tile
		const start = this.tile * TILE_SIZE_BYTES;
		const firstPlane = chrRom.slice(start, start + TILE_SIZE_BYTES / 2);
		const secondPlane = chrRom.slice(
			start + TILE_SIZE_BYTES / 2,
			start + TILE_SIZE_BYTES
		);

		const pixels = []; // TODO: Avoid allocation
		for (let y = 0; y < TILE_SIZE_Y; y++) {
			const row1 = firstPlane[y];
			const row2 = secondPlane[y];

			for (let x = 0; x < TILE_SIZE_X; x++) {
				const column = TILE_SIZE_X - 1 - x;
				const lsb = Byte.getBit(row1, column);
				const msb = Byte.getBit(row2, column);
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