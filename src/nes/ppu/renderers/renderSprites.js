import constants from "../../constants";
import _ from "lodash";

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

/** Draws a list of `sprites` into a buffer. */
const drawSpritesIntoBuffer = (context, sprites) => {
	const { ppu } = context;
	const { ppuMask } = ppu.registers;
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
			const isOpaque = paletteIndex !== constants.COLOR_TRANSPARENT;

			// add to drawing buffer
			if (isOpaque) {
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

/** Fetches the opaque sprite 0 pixels and stores them in the PPU. */
export function fetchSprite0HitPixels(context) {
	const { ppu } = context;
	const { ppuStatus, ppuMask } = ppu.registers;

	ppu.sprite0HitPixels = [];

	const sprite0 = ppu.oam.createSprite(0);
	const isVisible = sprite0.shouldRenderInScanline(ppu.scanline);
	if (!isVisible || ppuStatus.sprite0Hit === 1) return;

	const insideY = sprite0.diffY(ppu.scanline);
	for (let insideX = 0; insideX < constants.TILE_LENGTH; insideX++) {
		const finalX = sprite0.x + insideX;
		if (!ppuMask.showSpritesInLeftmost8PixelsOfScreen && finalX < 8) continue;

		const isOpaque =
			getSpritePixelPaletteIndex(context, sprite0, insideX, insideY) !==
			constants.COLOR_TRANSPARENT;

		if (isOpaque && finalX !== constants.SPRITE_0_HIT_IGNORED_X)
			ppu.sprite0HitPixels.push(finalX);
	}
}
