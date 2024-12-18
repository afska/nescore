import { WriteOnlyInMemoryRegister } from "../../registers";

/**
 * PPU Mask Register (> write)
 *
 * Controls the rendering of sprites and backgrounds, as well as colour effects.
 */
export default class PPUMask extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("grayscale", 0)
			.addReadOnlyField("showBackgroundInLeftmost8PixelsOfScreen", 1)
			.addReadOnlyField("showSpritesInLeftmost8PixelsOfScreen", 2)
			.addReadOnlyField("showBackground", 3)
			.addReadOnlyField("showSprites", 4)
			.addReadOnlyField("emphasizeRed", 5)
			.addReadOnlyField("emphasizeGreen", 6)
			.addReadOnlyField("emphasizeBlue", 7);
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

		if (this.emphasizeRed || this.emphasizeGreen || this.emphasizeBlue) {
			const all =
				this.emphasizeRed && this.emphasizeGreen && this.emphasizeBlue;
			r = this.emphasizeRed && !all ? r : Math.floor(r * 0.75);
			g = this.emphasizeGreen && !all ? g : Math.floor(g * 0.75);
			b = this.emphasizeBlue && !all ? b : Math.floor(b * 0.75);
		}

		return (r << 0) | (g << 8) | (b << 16);
	}

	/** Returns whether any rendering (background or sprites) is active or not. */
	get isRenderingEnabled() {
		return this.showBackground || this.showSprites;
	}
}
