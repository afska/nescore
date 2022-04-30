import constants from "../../constants";

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
			sprites.length < constants.MAX_SPRITES_PER_SCANLINE
		)
			sprites.push(sprite);
	}

	return sprites;
};

/** Draws a list of `sprites` on screen. */
const drawSprites = ({ ppu }, sprites) => {
	for (let sprite of sprites) {
		const diffY = sprite.diffY(ppu.scanline);

		for (let insideX = 0; insideX < constants.TILE_LENGTH; insideX++) {
			const paletteId = sprite.paletteId;
			const paletteIndex = ppu.patternTable.getPaletteIndexOf(
				ppu.registers.ppuCtrl.patternTableAddressIdFor8x8Sprites,
				sprite.tileId,
				sprite.flipX ? constants.TILE_LENGTH - 1 - insideX : insideX,
				diffY
			);

			if (paletteIndex > 0) {
				const color = ppu.framePalette.getColorOf(paletteId, paletteIndex);
				ppu.plot(sprite.x + insideX, ppu.scanline, color);
			}
		}
	}
};
