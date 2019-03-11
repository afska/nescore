import { WithContext } from "../helpers";

// TODO: Add docs

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
		const start = this.tile * 16;
		const firstPlane = chrRom.slice(start, start + 8);
		const secondPlane = chrRom.slice(start + 8, start + 16);

		const pixels = [];
		for (let i = 0; i < firstPlane.length; i++) {
			const color1 = firstPlane[i];

			const lsb1 = !!(color1 & 0b10000000);
			const lsb2 = !!(color1 & 0b01000000);
			const lsb3 = !!(color1 & 0b00100000);
			const lsb4 = !!(color1 & 0b00010000);
			const lsb5 = !!(color1 & 0b00001000);
			const lsb6 = !!(color1 & 0b00000100);
			const lsb7 = !!(color1 & 0b00000010);
			const lsb8 = !!(color1 & 0b00000001);

			const color2 = secondPlane[i];
			const msb1 = !!(color2 & 0b10000000);
			const msb2 = !!(color2 & 0b01000000);
			const msb3 = !!(color2 & 0b00100000);
			const msb4 = !!(color2 & 0b00010000);
			const msb5 = !!(color2 & 0b00001000);
			const msb6 = !!(color2 & 0b00000100);
			const msb7 = !!(color2 & 0b00000010);
			const msb8 = !!(color2 & 0b00000001);

			pixels.push(lsb1 + msb1 * 2);
			pixels.push(lsb2 + msb2 * 2);
			pixels.push(lsb3 + msb3 * 2);
			pixels.push(lsb4 + msb4 * 2);
			pixels.push(lsb5 + msb5 * 2);
			pixels.push(lsb6 + msb6 * 2);
			pixels.push(lsb7 + msb7 * 2);
			pixels.push(lsb8 + msb8 * 2);
		}

		const palette = ["#ffffff", "#cecece", "#686868", "#000000"];

		pixels.forEach((p, i) => {
			document.querySelector(`#p${i}`).style.backgroundColor = palette[p];
		});

		this.tile++;
		// TODO: Do it
	}
}
