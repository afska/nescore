import { RewiredMemoryChunk } from "../memory";

// Name tables A and B are located in 0x000 and 0x400 but can be remapped.

const HORIZONTAL = RewiredMemoryChunk.createMapping([
	{ from: 0x400, size: 0x400, to: 0x000 }, // top-right (A mirror)
	{ from: 0x800, size: 0x400, to: 0x400 }, // bottom-left (B)
	{ from: 0xc00, size: 0x400, to: 0x400 } // bottom-right (B mirror)
]);

const VERTICAL = RewiredMemoryChunk.createMapping([
	{ from: 0x800, size: 0x400, to: 0x000 }, // bottom-left (A mirror)
	{ from: 0xc00, size: 0x400, to: 0x400 } // bottom-right (B mirror)
]);

const ONE_SCREEN_LOWER_BANK = RewiredMemoryChunk.createMapping([
	{ from: 0x400, size: 0x400, to: 0x000 }, // top-right (A mirror)
	{ from: 0x800, size: 0x400, to: 0x000 }, // bottom-left (A mirror)
	{ from: 0xc00, size: 0x400, to: 0x000 } // bottom-right (A mirror)
]);

const ONE_SCREEN_UPPER_BANK = RewiredMemoryChunk.createMapping([
	{ from: 0x000, size: 0x400, to: 0x400 }, // top-left (A mirror)
	{ from: 0x800, size: 0x400, to: 0x400 }, // bottom-left (A mirror)
	{ from: 0xc00, size: 0x400, to: 0x400 } // bottom-right (A mirror)
]);

const FOUR_SCREENS = {}; // (the complete 4KB area is available)

export default {
	HORIZONTAL,
	VERTICAL,
	ONE_SCREEN_LOWER_BANK,
	ONE_SCREEN_UPPER_BANK,
	FOUR_SCREENS
};
