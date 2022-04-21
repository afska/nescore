const SCREEN_WIDTH = 256;
const TILE_SIZE = 8;
const TEST_PALETTE = [0xffffff, 0xcecece, 0x686868, 0x000000];

export default (context) => {
	renderBackground(context);
};

const renderBackground = ({ ppu }) => {
	if (ppu.cycle < SCREEN_WIDTH) {
		const x = ppu.cycle;
		const y = ppu.scanline;

		const colorIndex = ppu.patternTable.getColorIndexOf(
			ppu.registers.ppuCtrl.patternTableAddressIdForBackground,
			ppu.nameTable.getTileIdOf(0, x, y),
			x % TILE_SIZE,
			y % TILE_SIZE
		);

		ppu.plot(x, y, TEST_PALETTE[colorIndex]);
	}
};
