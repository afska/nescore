import constants from "../../constants";
import _ from "lodash";

/** Renders the sprites from OAM. */
export default (context) => {
	const sprites = evaluateSprites(context);
	drawSprites(context, sprites);
};

/** Evaluates which sprites should be rendered in the current scanline. */
const evaluateSprites = ({ ppu }) => {
	const sprites = [];

	for (let spriteId = 0; spriteId < constants.MAX_SPRITES; spriteId++) {
		const sprite = ppu.oam.createSprite(spriteId);

		if (
			sprite.shouldRenderInScanline(ppu.scanline) &&
			sprites.length < constants.MAX_SPRITES_PER_SCANLINE + 1
		) {
			if (sprites.length < constants.MAX_SPRITES_PER_SCANLINE)
				sprites.push(sprite);
			else ppu.registers.ppuStatus.spriteOverflow = 1;
		}
	}

	// (sprites on lower addresses have greater priority)
	return _.orderBy(sprites, ["id"], ["desc"]);
};

/** Draws a list of `sprites` on screen. */
const drawSprites = ({ ppu }, sprites) => {
	for (let sprite of sprites) {
		const insideY = sprite.diffY(ppu.scanline);

		for (let insideX = 0; insideX < constants.TILE_LENGTH; insideX++) {
			const finalX = sprite.x + insideX;
			const finalY = ppu.scanline;

			const paletteId = sprite.paletteId;
			const paletteIndex = ppu.patternTable.getPaletteIndexOf(
				ppu.registers.ppuCtrl.patternTableAddressIdFor8x8Sprites,
				sprite.tileId,
				sprite.flipX ? constants.TILE_LENGTH - 1 - insideX : insideX,
				sprite.flipY ? constants.TILE_LENGTH - 1 - insideY : insideY
			);

			const shouldDraw =
				paletteIndex !== constants.COLOR_TRANSPARENT &&
				(sprite.isInFrontOfBackground ||
					ppu.paletteIndexOf(finalX, finalY) === constants.COLOR_TRANSPARENT);

			if (shouldDraw) {
				const color = ppu.framePalette.getColorOf(paletteId, paletteIndex);
				ppu.plot(finalX, finalY, color);
			}
		}
	}
};
