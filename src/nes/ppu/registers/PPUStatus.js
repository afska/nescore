import { InMemoryRegister } from "../../registers";

/**
 * PPU Status Register
 *
 * Reflects the state of various functions inside the PPU.
 * It is often used for determining timing.
 */

export default class PPUStatus extends InMemoryRegister {
	constructor() {
		super(0x2002);

		this.addField("spriteOverflow", 5)
			.addField("sprite0Hit", 6)
			.addField("vBlankHasStarted", 7);
	}
}
