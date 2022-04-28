import { InMemoryRegister } from "../../registers";

/**
 * OAM Data Port (<> read/write)
 *
 * Write OAM data here. Writes will increment `OAMAddr` after the write.
 */
export default class OAMData extends InMemoryRegister {
	/** Reads a value from PPU's internal OAM. */
	readAt() {
		const { ppu } = this.context;

		const oamAddress = ppu.registers.oamAddr.value;
		return ppu.oamRam.readAt(oamAddress);
	}

	/** Writes a `byte` to PPU's internal OAM and increments `OAMAddr`. */
	writeAt(__, byte) {
		const { ppu } = this.context;

		const oamAddress = ppu.registers.oamAddr.value;
		ppu.oamRam.writeAt(oamAddress, byte);
		this._incrementAddress();
	}

	_incrementAddress() {
		this.context.ppu.registers.oamAddr.value++;
	}
}
