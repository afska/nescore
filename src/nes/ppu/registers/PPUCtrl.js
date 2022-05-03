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

	/** Sets the actual value and updates scrolling metadata. */
	writeAt(__, byte) {
		this.value = Byte.force8Bit(byte);

		this._updateLoopyRegisters();
	}

	/** Returns the `PPUAddr` increment per CPU read/write of `PPUData`. */
	get vramAddressIncrement() {
		return this.vramAddressIncrement32 === 1 ? 32 : 1;
	}

	/** Returns the sprite height. */
	get spriteHeight() {
		return this.spriteSizeId === 0 ? 8 : 16;
	}

	_updateLoopyRegisters() {
		// Loopy $2000 write
		// t: ...GH.. ........ <- d: ......GH
		//    <used elsewhere> <- d: ABCDEF..

		this.context.ppu.registers.ppuScroll.tAddress.baseNameTableId = this.baseNameTableId;
	}
}
