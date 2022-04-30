import constants from "../../constants";

const NAMETABLE_ID = 0;

/** Runs for each visible scanline. Renders the image. */
export default (context) => {
	const { ppu } = context;

	if (
		ppu.cycle < constants.SCREEN_WIDTH &&
		ppu.cycle % constants.PPU_RENDER_FREQUENCY === 0
	)
		renderBackground(context);

	// TODO: REFACTOR
	if (ppu.cycle === 240) {
		// sprites
		const sprites = [];

		// --evaluation--
		for (let spriteId = 0; spriteId < constants.MAX_SPRITES; spriteId++) {
			const sprite = ppu.oam.createSprite(spriteId);
			const diffY = ppu.scanline - sprite.y; // TODO: MOVE TO Sprite

			if (
				diffY >= 0 &&
				diffY < 8 && // TODO: Replace 8 with spriteHeight
				sprites.length < constants.MAX_SPRITES_PER_SCANLINE
			)
				sprites.push(sprite);
		}

		// --drawing--
		for (let sprite of sprites) {
			const diffY = ppu.scanline - sprite.y;

			for (let insideX = 0; insideX < constants.TILE_SIZE; insideX++) {
				const paletteId = sprite.paletteId;
				const paletteIndex = ppu.patternTable.getPaletteIndexOf(
					ppu.registers.ppuCtrl.patternTableAddressIdFor8x8Sprites,
					sprite.tileId,
					insideX,
					diffY
				);
				const color = ppu.framePalette.getColorOf(paletteId, paletteIndex);

				ppu.plot(sprite.x + insideX, ppu.scanline, color);
			}
		}
	}
};

/** Renders the background. */
const renderBackground = ({ ppu }) => {
	const y = ppu.scanline;

	for (let i = 0; i < constants.PPU_RENDER_FREQUENCY; i++) {
		let x = ppu.cycle + i;

		const tileId = ppu.nameTable.getTileIdOf(NAMETABLE_ID, x, y);
		const paletteId = ppu.attributeTable.getPaletteIdOf(NAMETABLE_ID, x, y);
		const paletteIndex = ppu.patternTable.getPaletteIndexOf(
			ppu.registers.ppuCtrl.patternTableAddressIdForBackground,
			tileId,
			x % constants.TILE_SIZE,
			y % constants.TILE_SIZE
		);
		const color = ppu.framePalette.getColorOf(paletteId, paletteIndex);

		ppu.plot(x, y, color);
	}
};
