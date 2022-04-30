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
}
