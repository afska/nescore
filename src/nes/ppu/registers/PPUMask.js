import { InMemoryRegister } from "../../registers";

/**
 * PPU Mask Register (> write)
 *
 * Controls the rendering of sprites and backgrounds, as well as colour effects.
 */
export default class PPUMask extends InMemoryRegister {
	constructor() {
		super();

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
		let r = (color >> 0) & 0xff;
		let g = (color >> 8) & 0xff;
		let b = (color >> 16) & 0xff;

		if (this.grayscale) {
			const gray = Math.floor(r / 3) + Math.floor(g / 3) + Math.floor(b / 3);
			r = gray;
			g = gray;
			b = gray;
		}
		if (this.emphasizeAny) {
			r = this.emphasizeRed ? r : Math.floor(r / 3);
			g = this.emphasizeGreen ? g : Math.floor(g / 3);
			b = this.emphasizeBlue ? b : Math.floor(b / 3);
		}

		return (r << 0) | (g << 8) | (b << 16);
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Returns whether any color emphasis is active or not. */
	get emphasizeAny() {
		return this.emphasizeRed || this.emphasizeGreen || this.emphasizeBlue;
	}

	/** Returns whether any rendering (background or sprites) is active or not. */
	get isRenderingEnabled() {
		return this.showBackground || this.showSprites;
	}
}
