import { InMemoryRegister } from "../../registers";
import constants from "../../constants";
import { Byte } from "../../helpers";

/**
 * PPU Data Port (<> read/write)
 *
 * Read/Write VRAM data here. `PPUAddr` will be incremented after any read/write.
 * Reads are delayed by 1.
 */
export default class PPUData extends InMemoryRegister {
	/** When a context is loaded. */
	onLoad() {
		this.buffer = 0; // (used to simulate read delay)
	}

	/** Reads a value from PPU address space, delayed by one read (except for the Palette RAM). */
	readAt() {
		let data = this.buffer;

		const ppuAddress = this.context.ppu.registers.ppuAddr.address;
		this.buffer = this.context.memoryBus.ppu.readAt(ppuAddress);

		// (if the PPUAddr is inside Palette RAM area, skip the buffer)
		if (ppuAddress > constants.PPU_ADDRESSED_PALETTE_RAM_START_ADDRESS)
			data = this.buffer;

		// (reading increments `PPUAddr` as a side effect)
		if (!this.context.isDebugging) this._incrementAddress();

		return data;
	}

	/** Writes a `byte` to PPU address space and increments `PPUAddr`. */
	writeAt(__, byte) {
		const ppuAddress = this.context.ppu.registers.ppuAddr.address;
		this.context.memoryBus.ppu.writeAt(ppuAddress, byte);
		this._incrementAddress();
	}

	_incrementAddress() {
		const { registers } = this.context.ppu;

		registers.ppuAddr.address = Byte.force16Bit(
			registers.ppuAddr.address + registers.ppuCtrl.vramAddressIncrement
		);
	}
}
