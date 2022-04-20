import DebugPatternTable from "./DebugPatternTable";
import { WithContext } from "../../helpers";

const START_ADDRESS = 0x2000;
const NAME_TABLE_SIZE = 1024;
const TILE_SIZE = 8;
const TOTAL_TILES_X = 32;

/**
 * A background is made up of a grid of tiles, each tile being 8x8 pixels.
 * A frame is 256x240 pixels or 32x30 tiles.
 * A Nametable defines a background, living in VRAM.
 * Each byte represents a tile (they're indexes into the Pattern table).
 */
export default class DebugNametable {
	constructor() {
		WithContext.apply(this);
	}

	/** Renders the Nametable `id` using the `plot`(x, y, bgrColor) function. */
	renderNametable(id, plot) {
		this.requireContext();

		this.context.inDebugMode(() => {
			const startAddress = START_ADDRESS + id * NAME_TABLE_SIZE;
			const patternTableId = this.context.ppu.registers.ppuCtrl
				.patternTableAddressIdForBackground;

			for (let i = 0; i < NAME_TABLE_SIZE; i++) {
				const x = i % TOTAL_TILES_X;
				const y = Math.floor(i / TOTAL_TILES_X);
				const byte = this.context.memoryBus.ppu.readAt(startAddress + i);

				new DebugPatternTable()
					.loadContext(this.context)
					.renderTile(patternTableId, byte, plot, x * TILE_SIZE, y * TILE_SIZE);
			}
		});
	}
}
