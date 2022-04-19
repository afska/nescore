import { InMemoryRegister } from "../../registers";

/**
 * PPU Control Register (> write)
 *
 * Contains various flags controlling PPU operation.
 */
export default class PPUCtrl extends InMemoryRegister {
	constructor(memory, address) {
		super(memory, address);

		this.addField("baseNametableAddressId", 0, 2)
			.addField("vramAddressIncrement32", 2)
			.addField("patternTableAddressIdFor8x8Sprites", 3)
			.addField("patternTableAddressIdForBackground", 4)
			.addField("spriteSizeId", 5)
			.addField("masterSlaveSelect", 6)
			.addField("generateNmiAtStartOfVBlank", 7);
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	// TODO: Write jsdocs of properties

	get baseNametableAddress() {
		switch (this.baseNametableAddressId) {
			case 1:
				return 0x2400;
			case 2:
				return 0x2800;
			case 3:
				return 0x2c00;
			default:
				return 0x2000;
		}
	}

	get vramAddressIncrement() {
		return this.vramAddressIncrement32 === 1 ? 32 : 1;
	}

	get patternTableAddressFor8x8Sprites() {
		return this.patternTableAddressIdFor8x8Sprites === 0 ? 0x0000 : 0x1000;
	}

	get patternTableAddressForBackground() {
		return this.patternTableAddressIdForBackground === 0 ? 0x0000 : 0x1000;
	}

	get spriteWidth() {
		return 8;
	}

	get spriteHeight() {
		return this.spriteSizeId === 0 ? 8 : 16;
	}
}
