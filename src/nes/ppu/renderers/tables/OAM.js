import Sprite from "./Sprite";
import constants from "../../../constants";
import { WithContext } from "../../../helpers";

/**
 * OAM = "Object Attribute Memory"
 * An area of memory which defines a sprite list. It's located in a 256KB PPU's internal RAM.
 * Each sprite is 4 bytes, so the maximum amount of sprites is 64.
 * Sprites are defined by (y, tileId, attributes, x).
 *                                     76543210
 *                                     |||   ++- foregroundPaletteId
 *                                     ||+------ priority (0: in front of background, 1: behind background)
 *                                     |+------- horizontalFlip
 *                                     +-------- verticalFlip
 * All sprites are either 8x8 or 8x16 (depending on `PPUCtrl`'s bit 5).
 */
export default class OAM {
	constructor() {
		WithContext.apply(this);
	}

	/** Returns a new instance of the sprite #`id`. */
	createSprite(id) {
		const { oamRam, registers } = this.context.ppu;
		const address = id * constants.SPRITE_SIZE_BYTES;

		const y = oamRam.readAt(address + constants.SPRITE_BYTE_Y);
		const tileId = oamRam.readAt(address + constants.SPRITE_BYTE_TILE_ID);
		const attributes = oamRam.readAt(
			address + constants.SPRITE_BYTE_ATTRIBUTES
		);
		const x = oamRam.readAt(address + constants.SPRITE_BYTE_X);
		const height = registers.ppuCtrl.spriteHeight;

		return new Sprite(id, x, y, tileId, attributes, height);
	}
}
