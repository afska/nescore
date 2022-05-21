import { WriteOnlyInMemoryRegister } from "../../registers";

/**
 * PPU Address Register (>> write twice, upper byte first)
 *
 * Write the PPU address you want to access here, then write in `PPUData`.
 * Connected to `LoopyRegister`.
 */
export default class PPUAddr extends WriteOnlyInMemoryRegister {
	/** Alternately writes the MSB and the LSB of the address, and updates scrolling metadata. */
	writeAt(__, byte) {
		this.context.ppu.loopy.onPPUAddrWrite(byte);
		this._writeReadOnlyFields();
	}

	/** Returns the address. */
	get address() {
		return this.context.ppu.loopy.vAddress.to14BitNumber();
	}

	/** Sets the address. */
	set address(value) {
		this.context.ppu.loopy.vAddress.update(value);
	}

	/** Write latch. */
	get latch() {
		return this.context.ppu.loopy.latch;
	}
}
