import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";

/**
 * PPU Address Register (>> write twice, upper byte first)
 *
 * Write the PPU address you want to access here, then write in `PPUData`.
 */
export default class PPUAddr extends InMemoryRegister {
	/** When a context is loaded. */
	onLoad() {
		this.latch = false;
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Alternately writes the MSB and the LSB of the address. */
	writeAt(__, byte) {
		this.value = this.latch
			? Byte.to16Bit(Byte.highPartOf(this.value), byte)
			: Byte.to16Bit(byte, Byte.lowPartOf(this.value));
		this.latch = !this.latch;
	}
}
