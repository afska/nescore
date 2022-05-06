import { RewiredMemoryChunk } from "../memory";

const ONE_SCREEN_LOWER_BANK = RewiredMemoryChunk.createMapping([]);

const ONE_SCREEN_UPPER_BANK = RewiredMemoryChunk.createMapping([]);

const HORIZONTAL = RewiredMemoryChunk.createMapping([
	{ from: 0x400, size: 0x400, to: 0x000 }, // top-right (A mirror)
	{ from: 0x800, size: 0x400, to: 0x400 }, // bottom-left (B)
	{ from: 0xc00, size: 0x400, to: 0x400 } // bottom-right (B mirror)
]);

const VERTICAL = RewiredMemoryChunk.createMapping([
	{ from: 0x800, size: 0x400, to: 0x000 }, // bottom-left (A mirror)
	{ from: 0xc00, size: 0x400, to: 0x400 } // bottom-right (B mirror)
]);

export default {
	HORIZONTAL,
	VERTICAL,
	ONE_SCREEN_LOWER_BANK,
	ONE_SCREEN_UPPER_BANK
};
