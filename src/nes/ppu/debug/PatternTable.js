import { WithContext, Byte } from "../../helpers";

const START_ADDRESS = 0x0000;
const TILE_SIZE_X = 8;
const TILE_SIZE_Y = 8;
const TILE_SIZE_BYTES = 16;

const palette = [0xffffff, 0xcecece, 0x686868, 0x000000]; // TODO: Remove this

/**
 * An area of memory which defines the shapes of tiles that make up backgrounds and sprites.
 * Each tile is 16 bytes, made of two planes:
 * - The first plane controls bit 0 of the color
 * - The second plane controls bit 1 of the color.
 * Any pixel whose color is 0 is background/transparent.
 */
export default class PatternTable {
	constructor() {
		WithContext.apply(this);
	}

	/** Renders the tile `id` in (`startX`, `startY`) using the `plot`(x, y, bgrColor) function. */
	renderTile(id, startX, startY, plot) {
		const memory = this.context.memoryBus.ppu;
		const firstPlane = id * TILE_SIZE_BYTES;
		const secondPlane = firstPlane + TILE_SIZE_BYTES / 2;

		for (let y = 0; y < TILE_SIZE_Y; y++) {
			const row1 = memory.readAt(START_ADDRESS + firstPlane + y);
			const row2 = memory.readAt(START_ADDRESS + secondPlane + y);

			for (let x = 0; x < TILE_SIZE_X; x++) {
				const column = TILE_SIZE_X - 1 - x;
				const lsb = Byte.getBit(row1, column);
				const msb = Byte.getBit(row2, column);
				const color = (msb << 1) | lsb;

				plot(startX + x, startY + y, palette[color]);
			}
		}
	}
}
