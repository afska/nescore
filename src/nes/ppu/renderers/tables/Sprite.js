import constants from "../../../constants";
import { Byte } from "../../../helpers";

/** A sprite containing a position, a tile id and some attributes.  */
export default class Sprite {
	constructor(x, y, tileId, attributes) {
		this.x = x;
		this.y = y;
		this.tileId = tileId;
		this.attributes = attributes;
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
