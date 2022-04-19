import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";

/**
 * PPU Address Register (>> write twice, upper byte first)
 *
 * Write the address of VRAM you want to access here, then write in `PPUData`.
 */
export default class PPUAddr extends InMemoryRegister {
	onLoad() {
		this.latch = false;
		this.address = 0;
	}

	writeAt(address, byte) {
		this.address = this.latch
			? Byte.to16Bit(byte, Byte.lowPartOf(this.address))
			: Byte.to16Bit(Byte.highPartOf(this.address), byte);
	}

	readAt(address) {
		return 0;
	}
}
