import constants from "../../constants";

const TEST_PALETTE = [0xffffff, 0xcecece, 0x686868, 0x000000];

/** Runs for each visible scanline. Renders the image. */
export default (context) => {
	renderBackground(context);
};

/** Renders the background. */
const renderBackground = ({ ppu }) => {
	if (ppu.cycle < constants.SCREEN_WIDTH) {
		const x = ppu.cycle;
		const y = ppu.scanline;

		const colorIndex = ppu.patternTable.getColorIndexOf(
			ppu.registers.ppuCtrl.patternTableAddressIdForBackground,
			ppu.nameTable.getTileIdOf(0, x, y),
			x % constants.TILE_SIZE,
			y % constants.TILE_SIZE
		);

		ppu.plot(x, y, TEST_PALETTE[colorIndex]);
	}
};
