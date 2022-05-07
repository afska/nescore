import constants from "../../../constants";
import { WithContext, Byte } from "../../../helpers";

/**
 * An area of memory which defines the shapes of tiles that make up backgrounds and sprites.
 * It's located at $0000, and it's usually mapped to CHR ROM.
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
		const lowByte = this.getLowByteOf(patternTableId, tileId, y);
		const highByte = this.getHighByteOf(patternTableId, tileId, y);

		return this.getPaletteIndexFromBytes(lowByte, highByte, x);
	}

	/** Get first plane's `y`th byte from tile `tileId` of `patternTableId`. */
	getLowByteOf(patternTableId, tileId, y) {
		const startAddress = this._getStartAddress(patternTableId);
		const firstPlane = tileId * constants.TILE_SIZE;

		return this.context.memoryBus.ppu.readAt(startAddress + firstPlane + y);
	}

	/** Get second plane's `y`th byte from tile `tileId` of `patternTableId`. */
	getHighByteOf(patternTableId, tileId, y) {
		const startAddress = this._getStartAddress(patternTableId);
		const firstPlane = tileId * constants.TILE_SIZE;
		const secondPlane = firstPlane + constants.TILE_SIZE / 2;

		return this.context.memoryBus.ppu.readAt(startAddress + secondPlane + y);
	}

	/** Builds a palette index from `lowByte` and `highByte` (bit 7-`x`). */
	getPaletteIndexFromBytes(lowByte, highByte, x) {
		const column = constants.TILE_LENGTH - 1 - x;
		const lsb = Byte.getBit(lowByte, column);
		const msb = Byte.getBit(highByte, column);

		return (msb << 1) | lsb;
	}

	_getStartAddress(patternTableId) {
		return (
			constants.PATTERN_TABLES_START_ADDRESS +
			patternTableId * constants.PATTERN_TABLE_SIZE
		);
	}
}
