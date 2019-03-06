import { WithComposedMemory, MemoryChunk } from "../memory";

const KB = 1024;
const PRG_ROM_PAGE_SIZE = 16 * KB;
const MEMORY_START_ADDRESS = 0x4020;
const MEMORY_SIZE = 0xbfe0;

/** Represents a dummy mapper, which works for cartridges with no mapper. */
export default class DummyMapper {
	constructor(cartridge) {
		WithComposedMemory.apply(this);

		const expansionRom = new MemoryChunk(0x1fe0);
		const sram = new MemoryChunk(0x2000, 0x6000);
		const zeroPagePrgRom = new MemoryChunk(
			cartridge.prgRom.slice(0, PRG_ROM_PAGE_SIZE),
			0x8000
		);
		const currentPagePrgRom = new MemoryChunk(
			cartridge.prgRom.slice(PRG_ROM_PAGE_SIZE, PRG_ROM_PAGE_SIZE * 2),
			0xc000
		);

		// TODO: defineChunk should set memoryStartAddress automatically, as WithComposedMemory expects the memory to be contiguous

		this.defineChunks([
			//                   Address   Size      Description
			expansionRom, //     $4020     $1FE0     Cartridge Expansion ROM
			sram, //             $6000     $2000     SRAM
			zeroPagePrgRom, //   $8000     $4000     PRG-ROM
			currentPagePrgRom // $C000     $4000     PRG-ROM
		]);
	}

	/** Returns the first address in the memory map. */
	get memoryStartAddress() {
		return MEMORY_START_ADDRESS;
	}

	/** Returns the assigned size in the memory map. */
	get memorySize() {
		return MEMORY_SIZE;
	}
}
