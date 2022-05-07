import { InMemoryRegister } from "../../registers";

/**
 * PPU Control Register (> write)
 *
 * Contains various flags controlling PPU operation.
 */
export default class PPUCtrl extends InMemoryRegister {
	constructor() {
		super();

		this.addField("baseNameTableId", 0, 2)
			.addField("vramAddressIncrement32", 2)
			.addField("patternTableAddressIdFor8x8Sprites", 3)
			.addField("patternTableAddressIdForBackground", 4)
			.addField("spriteSizeId", 5)
			.addField("generateNmiAtStartOfVBlank", 7);
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Returns the `PPUAddr` increment per CPU read/write of `PPUData`. */
	get vramAddressIncrement() {
		return this.vramAddressIncrement32 ? 32 : 1;
	}

	/** Returns true if sprites are 8x16. Otherwise, they're 8x8. */
	get isIn8x16Mode() {
		return this.spriteSizeId === 1;
	}
}
