import { InMemoryRegister } from "../../registers";

/**
 * PPU Address Register (>> write twice, upper byte first)
 *
 * Write the address of VRAM you want to access here, then write in `PPUData`.
 */

export default class PPUAddr extends InMemoryRegister {
	constructor() {
		super(0x2006, (byte) => {
			this.previousValue = this.value;

			// TODO: Add cycles
		});

		this.previousValue = null;
	}
}
