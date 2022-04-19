import { InMemoryRegister } from "../../registers";

/**
 * PPU Data Port (<> read/write)
 *
 * Read/Write VRAM data here. `PPUAddr` will be incremented after the operation.
 * Reads are delayed by 1.
 */
export default class PPUData extends InMemoryRegister {
	onLoad() {
		this.buffer = 0;
	}

	readAt() {
		let data = this.buffer;
		const ppuAddress = this.context.ppu.registers.ppuAddr.address;
		this.buffer = this.context.memoryBus.ppu.readAt(ppuAddress);

		// all reads are delayed by one, except for the palette ram
		if (ppuAddress > 0x3f00)
			// PALETTE_RAM_START
			data = this.buffer; // skip buffer

		return data;
	}

	writeAt(__, byte) {
		const ppuAddress = this.context.ppu.registers.ppuAddr.address;
		this.context.memoryBus.ppu.writeAt(ppuAddress, byte);
	}
}
