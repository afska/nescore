import { WriteOnlyInMemoryRegister } from "../../registers";
import constants from "../../constants";
import { Byte } from "../../helpers";

/**
 * OAM DMA Register (> write)
 *
 * Writing XX here will upload 256 bytes of data from CPU page $XX00-$XXFF to the internal PPU OAM.
 * This process takes 513 CPU cycles (+1 if on an odd cycle). The CPU is suspended during the operation.
 */
export default class OAMDMA extends WriteOnlyInMemoryRegister {
	/** Writes 256 bytes from page $`byte` to PPU's internal OAM. */
	writeAt(__, byte) {
		const { cpu, ppu, memoryBus } = this.context;

		for (let i = 0; i < 256; i++) {
			const address = Byte.to16Bit(byte, i);
			const value = cpu.memory.readAt(address);
			ppu.oamRam.writeAt(i, value);
		}

		cpu.extraCycles += constants.OAMDMA_CPU_CYCLES + (cpu.cycle % 2 === 1);
	}
}
