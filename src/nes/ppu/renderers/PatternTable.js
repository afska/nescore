import { WithContext, Byte } from "../../helpers";

const START_ADDRESS = 0x0000;
const PATTERN_TABLE_SIZE = 0x1000;
const TILE_SIZE = 8;
const TILE_SIZE_BYTES = 16;
const TEST_PALETTE = [0xffffff, 0xcecece, 0x686868, 0x000000];

/**
 * An area of memory which defines the shapes of tiles that make up backgrounds and sprites.
 * Each tile is 16 bytes, made of two planes:
 * - The first plane controls bit 0 of the color
 * - The second plane controls bit 1 of the color.
 * Any pixel whose color is 0 is background/transparent.
 */
export default class DebugPatternTable {
	constructor() {
		WithContext.apply(this);
	}

	/**
	 *  Renders the tile `id` from `patternTableId` in (`startX`, `startY`),
	 *  by using the `plot`(x, y, bgrColor) function.
	 */
	renderTile(patternTableId, id, plot, startX = 0, startY = 0) {
		this.requireContext();

		this.context.inDebugMode(() => {
			const startAddress = START_ADDRESS + patternTableId * PATTERN_TABLE_SIZE;
			const memory = this.context.memoryBus.ppu;
			const firstPlane = id * TILE_SIZE_BYTES;
			const secondPlane = firstPlane + TILE_SIZE_BYTES / 2;

			for (let y = 0; y < TILE_SIZE; y++) {
				const row1 = memory.readAt(startAddress + firstPlane + y);
				const row2 = memory.readAt(startAddress + secondPlane + y);

				for (let x = 0; x < TILE_SIZE; x++) {
					const column = TILE_SIZE - 1 - x;
					const lsb = Byte.getBit(row1, column);
					const msb = Byte.getBit(row2, column);
					const color = (msb << 1) | lsb;

					plot(startX + x, startY + y, TEST_PALETTE[color]);
				}
			}
		});
	}
}
