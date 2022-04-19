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

	readAt(address) {
		// this.isInVBlankInterval = true; // TODO: REMOVE // HACK

		const value = super.readAt(address);

		// reading the value has two side effects:

		// it resets the vertical blank flag
		this.isInVBlankInterval = 0;

		// it resets the address latch
		this.context.ppu.registers.ppuAddr.latch = false;

		return value;
	}

	writeAt(address, byte) {}

	reset() {
		this.value = 0b10000000;
	}
}
