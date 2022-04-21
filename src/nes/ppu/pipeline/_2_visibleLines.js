import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default (context) => {
	renderBackground(context);
};

/** Renders the background. */
const renderBackground = ({ ppu }) => {
	if (ppu.cycle < constants.SCREEN_WIDTH) {
		const x = ppu.cycle;
		const y = ppu.scanline;

		const paletteIndex = ppu.patternTable.getPaletteIndexOf(
			ppu.registers.ppuCtrl.patternTableAddressIdForBackground,
			ppu.nameTable.getTileIdOf(0, x, y),
			x % constants.TILE_SIZE,
			y % constants.TILE_SIZE
		);

		ppu.plot(x, y, ppu.framePalette.getColorOf(0, paletteIndex));
	}
};
