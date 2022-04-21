import { WithContext } from "../../helpers";

const START_ADDRESS = 0x2000;
const NAME_TABLE_SIZE = 1024;
const TOTAL_TILES_X = 32;

/**
 * A Name table defines a background, living in VRAM.
 * A background is made up of a grid of tiles, each tile being 8x8 pixels.
 * A frame is 256x240 pixels or 32x30 tiles.
 * Each byte represents a tile (they're indexes into the Pattern table).
 */
export default class NameTable {
	constructor() {
		WithContext.apply(this);
	}

	/** Returns a tile index to the background Pattern table that contains (`x`, `y`). */
	getTileIdOf(nameTableId, x, y) {
		const startAddress = START_ADDRESS + nameTableId * NAME_TABLE_SIZE;

		const tileX = Math.floor(x / 8);
		const tileY = Math.floor(y / 8);
		const tileIndex = tileY * TOTAL_TILES_X + tileX;

		return this.context.memoryBus.ppu.readAt(startAddress + tileIndex);
	}
}
