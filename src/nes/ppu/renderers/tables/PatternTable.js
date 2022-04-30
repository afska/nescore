import constants from "../../../constants";
import { WithContext, Byte } from "../../../helpers";

/**
 * An area of memory which defines the shapes of tiles that make up backgrounds and sprites.
 * It's located at $0000, and it's usually mapped to CHR-ROM.
 * Each tile is 16 bytes, made of two bit planes:
 * - The first plane controls bit 0 of the color.
 * - The second plane controls bit 1 of the color.
 * Any pixel whose color is 0 is background/transparent.
 */
export default class PatternTable {
	constructor() {
		WithContext.apply(this);
	}

	/**
	 * Returns the palette index of the pixel located in (`x`, `y`),
	 * from tile `tileId` of `patternTableId`.
	 */
	getPaletteIndexOf(patternTableId, tileId, x, y) {
		const startAddress =
			constants.PATTERN_TABLES_START_ADDRESS +
			patternTableId * constants.PATTERN_TABLE_SIZE;
		const firstPlane = tileId * constants.TILE_SIZE_BYTES;
		const secondPlane = firstPlane + constants.TILE_SIZE_BYTES / 2;

		const rowLowBits = this.context.memoryBus.ppu.readAt(
			startAddress + firstPlane + y
		);
		const rowHighBits = this.context.memoryBus.ppu.readAt(
			startAddress + secondPlane + y
		);

		const column = constants.TILE_SIZE - 1 - x;
		const lsb = Byte.getBit(rowLowBits, column);
		const msb = Byte.getBit(rowHighBits, column);

		return (msb << 1) | lsb;
	}
}
