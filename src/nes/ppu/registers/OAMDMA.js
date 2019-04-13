import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";

/**
 * OAM DMA Register (> write)
 *
 * Writing XX here will upload 256 bytes of data from CPU page $XX00-$XXFF to the internal PPU OAM.
 */

export default class OAMDMA extends InMemoryRegister {
	constructor() {
		super(0x4014, (page) => {
			for (let i = 0; i < 256; i++) {
				const { ppu, memory } = this.context;

				const address = Byte.to16Bit(page, i);
				const value = memory.readAt(address);
				ppu.oamRam.writeAt(i, value);
			}
			// TODO: This doesn't work, context is PPUMemory

			// TODO: Add 513 cycles (+1 on odd cycles) (+1 for the OAMDMA write tick)
		});
	}
}
