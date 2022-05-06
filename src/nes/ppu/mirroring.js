import { RewiredMemoryChunk } from "../memory";

const ONE_SCREEN_LOWER_BANK = RewiredMemoryChunk.createMapping([]);

const ONE_SCREEN_UPPER_BANK = RewiredMemoryChunk.createMapping([]);

// TODO: THINK NAMETABLES AS A 2KB MEMORY SEGMENT

const HORIZONTAL = RewiredMemoryChunk.createMapping([
	{ from: 0x400, size: 0x400, to: 0x000 },
	{ from: 0xc00, size: 0x400, to: 0x800 }
]);

const VERTICAL = RewiredMemoryChunk.createMapping([
	{ from: 0x800, size: 0x400, to: 0x000 },
	{ from: 0xc00, size: 0x400, to: 0x400 }
]);

export default {
	HORIZONTAL,
	VERTICAL,
	ONE_SCREEN_LOWER_BANK,
	ONE_SCREEN_UPPER_BANK
};
