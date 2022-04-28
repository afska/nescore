import constants from "../../constants";
import { Byte } from "../../helpers"; // TODO: REMOVE

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
		let totalSprites = 0;
		for (let spriteId = 0; spriteId < 64; spriteId++) {
			const y = ppu.oamRam.readAt(spriteId * 4 + 0 /* y */);
			const diffY = ppu.scanline - y;

			if (diffY >= 0 && diffY < 8 && totalSprites < 8) {
				// TODO: Replace 8 with spriteHeight
				sprites.push(spriteId);
				totalSprites++;
			}
		}

		// --drawing--
		for (let spriteId of sprites) {
			const x = ppu.oamRam.readAt(spriteId * 4 + 3 /* x */);
			const y = ppu.oamRam.readAt(spriteId * 4 + 0 /* y */);
			const diffY = ppu.scanline - y;

			for (let insideX = 0; insideX < constants.TILE_SIZE; insideX++) {
				const tileId = ppu.oamRam.readAt(spriteId * 4 + 1 /* tileId */);
				const paletteId =
					4 +
					Byte.getSubNumber(
						ppu.oamRam.readAt(spriteId * 4 + 2 /* attribute */),
						0,
						2
					);
				const paletteIndex = ppu.patternTable.getPaletteIndexOf(
					ppu.registers.ppuCtrl.patternTableAddressIdFor8x8Sprites,
					tileId,
					insideX,
					diffY
				);
				const color = ppu.framePalette.getColorOf(paletteId, paletteIndex);

				ppu.plot(x + insideX, ppu.scanline, color);
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
