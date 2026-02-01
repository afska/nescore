import constants from "../../constants";

/** Renders the sprites from OAM. */
export default function renderSprites(context) {
	const sprites = evaluateSprites(context);
	const buffer = drawSpritesIntoBuffer(context, sprites);
	drawSprites(context, buffer);
}

/** Evaluates which sprites should be rendered in the current scanline. */
const evaluateSprites = ({ ppu }) => {
	const sprites = [];

	for (let spriteId = 0; spriteId < constants.MAX_SPRITES; spriteId++) {
		const sprite = ppu.oam.createSprite(spriteId);

		if (sprite.shouldRenderInScanline(ppu.scanline)) {
			if (sprites.length < constants.MAX_SPRITES_PER_SCANLINE) {
				sprites.push(sprite);
			} else {
				ppu.registers.ppuStatus.spriteOverflow = 1;
				break;
			}
		}
	}

	// (sprites on lower addresses have greater priority)
	return sprites.reverse();
};

/** Draws a list of `sprites` into a buffer. */
const drawSpritesIntoBuffer = (context, sprites) => {
	const { ppu } = context;
	const { ppuMask, ppuStatus } = ppu.registers;
	const finalY = ppu.scanline;

	const buffer = { colors: [], priorities: [], xs: [] };

	for (let sprite of sprites) {
		const insideY = sprite.diffY(finalY);

		for (let insideX = 0; insideX < constants.TILE_LENGTH; insideX++) {
			const finalX = sprite.x + insideX;
			if (!ppuMask.showSpritesInLeftmost8PixelsOfScreen && finalX < 8) continue;

			// color fetch
			const paletteId = sprite.paletteId;
			const paletteIndex = getSpritePixelPaletteIndex(
				context,
				sprite,
				insideX,
				insideY
			);
			const isSpritePixelOpaque = paletteIndex !== constants.COLOR_TRANSPARENT;
			const isBackgroundPixelOpaque =
				ppu.paletteIndexOf(finalX, finalY) !== constants.COLOR_TRANSPARENT;

			// sprite 0 hit
			if (
				sprite.id === 0 &&
				isSpritePixelOpaque &&
				isBackgroundPixelOpaque &&
				ppuMask.showBackground &&
				ppuMask.showSprites
			)
				ppuStatus.sprite0Hit = 1;

			// add to drawing buffer
			if (isSpritePixelOpaque) {
				const color = ppu.framePalette.getColorOf(paletteId, paletteIndex);
				buffer.colors[finalX] = color;
				buffer.priorities[finalX] = sprite.isInFrontOfBackground;
				buffer.xs[finalX] = finalX;
			}
		}
	}

	return buffer;
};

/** Draws a `buffer` using the PPU, in the right layer. */
const drawSprites = ({ ppu }, { colors, priorities, xs }) => {
	const finalY = ppu.scanline;

	for (let finalX of xs) {
		const isInFrontOfBackground = priorities[finalX];
		const color = colors[finalX];

		// sprite/background priority
		const isBackgroundPixelOpaque =
			ppu.paletteIndexOf(finalX, finalY) !== constants.COLOR_TRANSPARENT;
		const shouldDraw = isInFrontOfBackground || !isBackgroundPixelOpaque;

		// actual drawing
		if (shouldDraw) ppu.plot(finalX, finalY, color);
	}
};

/** Returns the (`insideX`, `insideY`) `sprite`'s pixel palette index. */
const getSpritePixelPaletteIndex = ({ ppu }, sprite, insideX, insideY) => {
	const tileInsideY = insideY % constants.TILE_LENGTH;

	return ppu.patternTable.getPaletteIndexOf(
		sprite.patternTableId,
		sprite.tileIdFor(insideY),
		sprite.flipX ? constants.TILE_LENGTH - 1 - insideX : insideX,
		sprite.flipY ? constants.TILE_LENGTH - 1 - tileInsideY : tileInsideY
	);
};
