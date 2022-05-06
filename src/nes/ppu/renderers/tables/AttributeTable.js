import constants from "../../../constants";
import { Byte, WithContext } from "../../../helpers";

/**
 * An area of memory which defines what palette (0~3) each background tile uses.
 * It's a 64-byte array located at the end of each Name table.
 * The background is divided into blocks, each of which is 4x4 tiles.
 * Every block is divided into four regions of 2x2 tiles.
 * Each byte represents a block in that matrix.
 * (Bits 0,1 = Quad 0; Bits 2,3 = Quad 1; Bits 4,5 = Quad 2; Bits 6,7 = Quad 3)
 */
export default class AttributeTable {
	constructor() {
		WithContext.apply(this);
	}

	/** Returns the palette id of the pixel located in (`x`, `y`) from `nameTableId`. */
	getPaletteIdOf(nameTableId, x, y) {
		const startAddress =
			constants.NAME_TABLES_START_ADDRESS +
			(nameTableId + 1) * constants.NAME_TABLE_SIZE -
			constants.ATTRIBUTE_TABLE_SIZE;

		const blockX = Math.floor(x / constants.ATTRIBUTE_TABLE_BLOCK_SIZE);
		const blockY = Math.floor(y / constants.ATTRIBUTE_TABLE_BLOCK_SIZE);
		const blockIndex =
			blockY * constants.ATTRIBUTE_TABLE_TOTAL_BLOCKS_X + blockX;

		const regionX = Math.floor(
			(x % constants.ATTRIBUTE_TABLE_BLOCK_SIZE) /
				constants.ATTRIBUTE_TABLE_REGION_SIZE
		);
		const regionY = Math.floor(
			(y % constants.ATTRIBUTE_TABLE_BLOCK_SIZE) /
				constants.ATTRIBUTE_TABLE_REGION_SIZE
		);
		const regionIndex =
			regionY * constants.ATTRIBUTE_TABLE_TOTAL_REGIONS_X + regionX;

		const block = this.context.memoryBus.ppu.readAt(startAddress + blockIndex);

		return (
			constants.PALETTE_BACKGROUND_START +
			Byte.getSubNumber(
				block,
				regionIndex * constants.ATTRIBUTE_TABLE_REGION_SIZE_BITS,
				constants.ATTRIBUTE_TABLE_REGION_SIZE_BITS
			)
		);
	}
}
