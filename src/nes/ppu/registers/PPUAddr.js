import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";

/**
 * PPU Address Register (>> write twice, upper byte first)
 *
 * Write the PPU address you want to access here, then write in `PPUData`.
 * Connected to `LoopyRegister`.
 */
export default class PPUAddr extends InMemoryRegister {
	/** When a context is loaded. */
	onLoad() {
		this.address = 0;
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Alternately writes the MSB and the LSB of the address, and updates scrolling metadata. */
	writeAt(__, byte) {
		this.address = this.latch
			? Byte.to16Bit(Byte.highPartOf(this.address), byte)
			: Byte.to16Bit(byte, Byte.lowPartOf(this.address));

		this.context.ppu.loopy.onPPUAddrWrite(byte);
	}

	/** Write latch. */
	get latch() {
		return this.context.ppu.loopy.latch;
	}
}
