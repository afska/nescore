import constants from "../../constants";
import _ from "lodash";

/** Renders the sprites from OAM. */
export default function renderSprites(context) {
	const sprites = evaluateSprites(context);
	drawSprites(context, sprites);
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

/** Draws a list of `sprites` on the current scanline. */
const drawSprites = (context, sprites) => {
	const { ppu } = context;
	const { ppuMask, ppuStatus } = ppu.registers;
	const finalY = ppu.scanline;

	const colors = [];
	const priorities = [];
	const xs = [];

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
				colors[finalX] = ppu.framePalette.getColorOf(paletteId, paletteIndex);
				priorities[finalX] = sprite.isInFrontOfBackground;
				xs[finalX] = finalX;
			}
		}
	}

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
