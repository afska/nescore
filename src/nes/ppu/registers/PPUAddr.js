import { InMemoryRegister } from "../../registers";

/**
 * PPU Address Register (>> write twice, upper byte first)
 *
 * The CPU writes to VRAM through a pair of registers on the PPU.
 * First it loads an address into `PPUAddr`, and then it writes repeatedly to `PPUData` to fill VRAM.
 */

export default class PPUAddr extends InMemoryRegister {
	constructor() {
		super(0x2006);
	}
}
