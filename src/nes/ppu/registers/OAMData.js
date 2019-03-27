import { InMemoryRegister } from "../../registers";

/**
 * OAM Data Port (<> read/write)
 *
 * Write OAM data here. Writes will increment `OAMAddr` after the write.
 */

export default class OAMAddr extends InMemoryRegister {
	constructor() {
		super(0x2004, (value) => {
			const { ppu } = this.context;
			const { oamAddr } = ppu.registers;

			const address = oamAddr.value;
			ppu.oamRam.writeAt(address, value);
			oamAddr.value++;

			// TODO: Add cycles
		});
	}
}
