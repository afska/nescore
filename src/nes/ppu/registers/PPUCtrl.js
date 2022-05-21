import { WriteOnlyInMemoryRegister } from "../../registers";

/**
 * PPU Control Register (> write)
 *
 * Contains various flags controlling PPU operation.
 * Connected to `LoopyRegister`.
 */
export default class PPUCtrl extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("vramAddressIncrement32", 2)
			.addReadOnlyField("patternTableAddressIdFor8x8Sprites", 3)
			.addReadOnlyField("patternTableAddressIdForBackground", 4)
			.addReadOnlyField("spriteSizeId", 5)
			.addReadOnlyField("generateNmiAtStartOfVBlank", 7);
	}

	/** Sets the actual value and updates scrolling metadata. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.ppu.loopy.onPPUCtrlWrite(byte);
	}

	/** Returns the base Name table id. */
	get baseNameTableId() {
		return this.context.ppu.loopy.vAddress.baseNameTableId;
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
