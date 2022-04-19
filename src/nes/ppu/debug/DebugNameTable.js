import DebugPatternTable from "./DebugPatternTable";
import { WithContext } from "../../helpers";

const START_ADDRESS = 0x2000;
const PATTERN_TABLE_SIZE = 1024;
const TILE_SIZE = 8;
const TOTAL_TILES_X = 32;

/**
 * A background is made up of a grid of tiles, each tile being 8x8 pixels.
 * A frame is 256x240 pixels or 32x30 tiles.
 * A Name Table defines a background, living in VRAM.
 * Each byte represents a tile (they're indexes into the Pattern Table).
 */
export default class DebugNameTable {
	constructor() {
		WithContext.apply(this);
	}

	/** Renders the tile `id` using the `plot`(x, y, bgrColor) function. */
	renderNameTable(id, plot) {
		this.requireContext();

		this.context.inDebugMode(() => {
			const startAddress = START_ADDRESS + id * PATTERN_TABLE_SIZE;

			for (let i = 0; i < PATTERN_TABLE_SIZE; i++) {
				const x = i % TOTAL_TILES_X;
				const y = Math.floor(i / TOTAL_TILES_X);
				const byte = this.context.memoryBus.ppu.readAt(startAddress + i);

				new DebugPatternTable()
					.loadContext(this.context)
					.renderTile(byte, plot, x * TILE_SIZE, y * TILE_SIZE);
			}
		});
	}
}
