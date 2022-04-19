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

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}
}
