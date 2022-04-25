import constants from "../../constants";

const NAMETABLE_ID = 0;

/** Runs for each visible scanline. Renders the image. */
export default (context) => {
	renderBackground(context);
};

/** Renders the background. */
const renderBackground = ({ ppu }) => {
	if (ppu.cycle < constants.SCREEN_WIDTH) {
		const x = ppu.cycle;
		const y = ppu.scanline;

		const paletteId = ppu.attributeTable.getPaletteIdOf(NAMETABLE_ID, x, y);

		const paletteIndex = ppu.patternTable.getPaletteIndexOf(
			ppu.registers.ppuCtrl.patternTableAddressIdForBackground,
			ppu.nameTable.getTileIdOf(NAMETABLE_ID, x, y),
			x % constants.TILE_SIZE,
			y % constants.TILE_SIZE
		);

		ppu.plot(x, y, ppu.framePalette.getColorOf(paletteId, paletteIndex));
	}
};
