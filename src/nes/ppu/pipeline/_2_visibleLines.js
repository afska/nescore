import constants from "../../constants";

const NAMETABLE_ID = 0;

/** Runs for each visible scanline. Renders the image. */
export default (context) => {
	renderBackground(context);
};

/** Renders the background. */
const renderBackground = ({ ppu }) => {
	if (ppu.cycle < constants.SCREEN_WIDTH) {
		if (ppu.cycle % constants.PPU_RENDER_FREQUENCY === 0) {
			const y = ppu.scanline;

			for (let i = 0; i < constants.PPU_RENDER_FREQUENCY; i++) {
				let x = ppu.cycle + i;

				const paletteId = ppu.attributeTable.getPaletteIdOf(NAMETABLE_ID, x, y);

				const paletteIndex = ppu.patternTable.getPaletteIndexOf(
					ppu.registers.ppuCtrl.patternTableAddressIdForBackground,
					ppu.nameTable.getTileIdOf(NAMETABLE_ID, x, y),
					x % constants.TILE_SIZE,
					y % constants.TILE_SIZE
				);

				ppu.plot(x, y, ppu.framePalette.getColorOf(paletteId, paletteIndex));
			}
		}
	}
};
