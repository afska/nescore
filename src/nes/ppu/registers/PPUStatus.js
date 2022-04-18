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

	reset() {
		this.value = 0b10000000;
	}
}
