import constants from "../../../constants";
import { Byte } from "../../../helpers";

/** A sprite containing an id, position, height, a tile id and some attributes.  */
export default class Sprite {
	constructor(id, x, y, patternTableId, tileId, attributes, is8x16) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.patternTableId = patternTableId;
		this.tileId = tileId;
		this.attributes = attributes;
		this.is8x16 = is8x16;
	}

	/**
	 * Returns the tile id for an `insideY` position.
	 * The bottom part of a 8x16 sprite uses the next tile index.
	 */
	tileIdFor(insideY) {
		let index = +(insideY >= constants.TILE_LENGTH);
		if (this.is8x16 && this.flipY) index = +!index;

		return this.tileId + index;
	}

	/** Returns whether it should appear in a certain `scanline` or not. */
	shouldRenderInScanline(scanline) {
		const diffY = this.diffY(scanline);

		return diffY >= 0 && diffY < this.height;
	}

	/** Returns the difference between a `scanline` and sprite's Y coordinate. */
	diffY(scanline) {
		return scanline - this.y;
	}

	/** Returns the palette id of the sprite. */
	get paletteId() {
		return (
			constants.PALETTE_FOREGROUND_START +
			Byte.getSubNumber(
				this.attributes,
				constants.SPRITE_ATTR_PALETTE_BITS_START,
				constants.SPRITE_ATTR_PALETTE_BITS_SIZE
			)
		);
	}

	/** Returns whether the sprite is in front of background or not. */
	get isInFrontOfBackground() {
		return !Byte.getBit(this.attributes, constants.SPRITE_ATTR_PRIORITY_BIT);
	}

	/** Returns whether the sprite is horizontally flipped or not. */
	get flipX() {
		return !!Byte.getBit(
			this.attributes,
			constants.SPRITE_ATTR_HORIZONTAL_FLIP_BIT
		);
	}

	/** Returns whether the sprite is vertically flipped or not. */
	get flipY() {
		return !!Byte.getBit(
			this.attributes,
			constants.SPRITE_ATTR_VERTICAL_FLIP_BIT
		);
	}

	/** Returns the sprite height. */
	get height() {
		return this.is8x16 ? 16 : 8;
	}
}
