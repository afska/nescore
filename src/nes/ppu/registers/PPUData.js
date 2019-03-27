import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";

/**
 * PPU Data Port (<> read/write)
 *
 * Read/Write VRAM data here. `PPUAddr` will be incremented after the operation.
 */

export default class PPUData extends InMemoryRegister {
	constructor() {
		super(0x2007, (value) => {
			const { ppu } = this.context;
			const { ppuAddr } = ppu.registers;

			const address = Byte.to16Bit(ppuAddr.previousValue, ppuAddr.value);
			ppu.memory.writeAt(address, value);
			ppuAddr.value++;

			// TODO: Add cycles
		});
	}
}
