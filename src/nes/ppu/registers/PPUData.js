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

	readAt(address) {
		const data = this.buffer;
		this.buffer = this.context.memoryBus.ppu.readAt(address);
		return data;
	}
}
