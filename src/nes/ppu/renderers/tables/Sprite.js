import constants from "../../../constants";
import { Byte } from "../../../helpers";

/** A sprite containing an id, position, height, a tile id and some attributes.  */
export default class Sprite {
	constructor(id, x, y, tileId, attributes, height) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.tileId = tileId;
		this.attributes = attributes;
		this.height = height;
	}

	/** Returns if it should appear in a certain `scanline`. */
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

	/** Returns if the sprite is in front of background. */
	get isInFrontOfBackground() {
		return !!Byte.getBit(this.attributes, constants.SPRITE_ATTR_PRIORITY_BIT);
	}

	/** Returns if the sprite is horizontally flipped. */
	get flipX() {
		return !!Byte.getBit(
			this.attributes,
			constants.SPRITE_ATTR_HORIZONTAL_FLIP_BIT
		);
	}

	/** Returns if the sprite is vertically flipped. */
	get flipY() {
		return !!Byte.getBit(
			this.attributes,
			constants.SPRITE_ATTR_VERTICAL_FLIP_BIT
		);
	}
}
