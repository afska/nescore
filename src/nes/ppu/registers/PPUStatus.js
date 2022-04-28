import { InMemoryRegister } from "../../registers";

/**
 * PPU Status Register (< read)
 *
 * Reflects the state of various functions inside the PPU.
 * It is often used for determining timing.
 */
export default class PPUStatus extends InMemoryRegister {
	constructor(memory, address) {
		super(memory, address);

		this.addField("spriteOverflow", 5)
			.addField("sprite0Hit", 6)
			.addField("isInVBlankInterval", 7);
	}

	/** Reads the status flags, with some side effects. */
	readAt(address) {
		const value = super.readAt(address);

		// this has two side effects:
		if (!this.context.isDebugging) {
			// - it resets the vertical blank flag
			this.isInVBlankInterval = 0;

			// - it resets the `PPUAddr`'s latch
			this.context.ppu.registers.ppuAddr.latch = false;
		}

		return value;
	}

	/** Writes nothing (read-only address). */
	writeAt() {}

	/** Resets the value. */
	reset() {
		this.value = 0b10000000;
	}
}
