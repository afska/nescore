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
 * On 8x16 mode, the first bit of `tileId` indicates the pattern table (ignoring `PPUCtrl`'s bit 3).
 */
export default class OAM {
	constructor() {
		WithContext.apply(this);
	}

	/** Returns a new instance of the sprite #`id`. */
	createSprite(id) {
		const { oamRam, registers } = this.context.ppu;
		const is8x16 = registers.ppuCtrl.isIn8x16Mode;

		const address = id * constants.SPRITE_SIZE;
		const yByte = oamRam[address + constants.SPRITE_BYTE_Y];
		const tileIdByte = oamRam[address + constants.SPRITE_BYTE_TILE_ID];
		const attributes = oamRam[address + constants.SPRITE_BYTE_ATTRIBUTES];
		const x = oamRam[address + constants.SPRITE_BYTE_X];

		const y = yByte + 1; // (sprite data is delayed by one scanline)
		const patternTableId = is8x16
			? tileIdByte & constants.SPRITE_8x16_PATTERN_TABLE_MASK
			: registers.ppuCtrl.patternTableAddressIdFor8x8Sprites;
		const tileId = is8x16
			? tileIdByte & constants.SPRITE_8x16_TILE_ID_MASK
			: tileIdByte;

		return new Sprite(id, x, y, patternTableId, tileId, attributes, is8x16);
	}
}
