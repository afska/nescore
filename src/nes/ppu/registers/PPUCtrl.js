import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";

/**
 * PPU Control Register (> write)
 *
 * Contains various flags controlling PPU operation.
 */
export default class PPUCtrl extends InMemoryRegister {
	constructor(memory, address) {
		super(memory, address);

		this.addField("baseNameTableId", 0, 2)
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

	/** Sets the actual value, ignoring changes on the first two bits if rendering is disabled. */
	writeAt(__, byte) {
		const baseNameTableId = this.baseNameTableId;

		this.value = Byte.force8Bit(byte);

		if (
			this.baseNameTableId !== baseNameTableId &&
			!this.context.ppu.registers.ppuMask.isRenderingEnabled
		)
			this.baseNameTableId = baseNameTableId;
	}

	/** Returns the `PPUAddr` increment per CPU read/write of `PPUData`. */
	get vramAddressIncrement() {
		return this.vramAddressIncrement32 === 1 ? 32 : 1;
	}

	/** Returns the sprite height. */
	get spriteHeight() {
		return this.spriteSizeId === 0 ? 8 : 16;
	}
}
