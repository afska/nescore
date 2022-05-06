import { InMemoryRegister } from "../../registers";

/**
 * PPU Mask Register (> write)
 *
 * Controls the rendering of sprites and backgrounds, as well as colour effects.
 */
export default class PPUMask extends InMemoryRegister {
	constructor(memory, address) {
		super(memory, address);

		this.addField("grayscale", 0)
			.addField("showBackgroundInLeftmost8PixelsOfScreen", 1)
			.addField("showSpritesInLeftmost8PixelsOfScreen", 2)
			.addField("showBackground", 3)
			.addField("showSprites", 4)
			.addField("emphasizeRed", 5)
			.addField("emphasizeGreen", 6)
			.addField("emphasizeBlue", 7);
	}

	/** Transforms a BGR `color` following the register's rules (grayscale or emphasize bits). */
	transform(color) {
		const r = (color >> 0) & 0xff;
		const g = (color >> 8) & 0xff;
		const b = (color >> 16) & 0xff;

		if (!!this.grayscale) {
			const gray = Math.floor(r / 3) + Math.floor(g / 3) + Math.floor(b / 3);
			return (gray << 0) | (gray << 8) | (gray << 16);
		} else if (!!this.emphasizeRed)
			return (r << 0) | (Math.floor(g / 3) << 8) | (Math.floor(b / 3) << 16);
		else if (!!this.emphasizeGreen)
			return (Math.floor(r / 3) << 0) | (g << 8) | (Math.floor(b / 3) << 16);
		else if (!!this.emphasizeBlue)
			return (Math.floor(r / 3) << 0) | (Math.floor(g / 3) << 8) | (b << 16);
		else return color;
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}
}
