import constants from "../../../constants";
import { WithContext } from "../../../helpers";

/**
 * An area of memory which defines a background. It's located at $2000 (VRAM).
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
		let tileX = Math.floor(x / constants.TILE_LENGTH);
		nameTableId += Math.floor(tileX / 32);
		tileX = tileX % 32;
		// TODO: REFACTOR / FINISH
		// TODO: UNDO AND DO IT OUTSIDE NAMETABLE

		let tileY = Math.floor(y / constants.TILE_LENGTH);
		const tileIndex = tileY * constants.NAME_TABLE_TOTAL_TILES_X + tileX;
		nameTableId += Math.floor(tileY / 30);
		tileY = tileY % 30;

		const startAddress =
			constants.NAME_TABLES_START_ADDRESS +
			nameTableId * constants.NAME_TABLE_SIZE;
		return this.context.memoryBus.ppu.readAt(startAddress + tileIndex);
	}
}
