import { WithContext, Byte } from "../../../helpers";

const START_ADDRESS = 0x0000;
const PATTERN_TABLE_SIZE = 0x1000;
const TILE_SIZE = 8;
const TILE_SIZE_BYTES = 16;

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
	 * Returns the color index of the pixel located in (`x`, `y`),
	 * from tile `tileId` of `patternTableId`.
	 */
	getColorIndexOf(patternTableId, tileId, x, y) {
		const startAddressPattern =
			START_ADDRESS + patternTableId * PATTERN_TABLE_SIZE;
		const firstPlane = tileId * TILE_SIZE_BYTES;
		const secondPlane = firstPlane + TILE_SIZE_BYTES / 2;

		const rowLowBits = this.context.memoryBus.ppu.readAt(
			startAddressPattern + firstPlane + y
		);
		const rowHighBits = this.context.memoryBus.ppu.readAt(
			startAddressPattern + secondPlane + y
		);

		const column = TILE_SIZE - 1 - x;
		const lsb = Byte.getBit(rowLowBits, column);
		const msb = Byte.getBit(rowHighBits, column);
		const colorIndex = (msb << 1) | lsb;

		return colorIndex;
	}
}
