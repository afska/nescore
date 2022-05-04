import constants from "../../constants";

/** Renders the background from the Name tables. */
export default ({ ppu }) => {
	const { registers } = ppu;
	const x = ppu.cycle;
	const y = ppu.scanline;
	const { x: scrollX, y: scrollY } = registers.ppuScroll;
	const scrolledX = x + scrollX;
	const scrolledY = y + scrollY;

	if (!registers.ppuMask.showBackgroundInLeftmost8PixelsOfScreen && x < 8) {
		const color = ppu.framePalette.getColorOf(0, 0);
		ppu.plot(x, y, color);
		ppu.savePaletteIndex(x, y, 0);
		return;
	}

	const baseNameTableId = registers.ppuCtrl.baseNameTableId;
	const nameTableId =
		baseNameTableId +
		Math.floor(scrolledX / constants.SCREEN_WIDTH) +
		Math.floor(scrolledY / constants.SCREEN_HEIGHT) *
			constants.NAME_TABLE_MATRIX_LENGTH;
	const nameTableX = scrolledX % constants.SCREEN_WIDTH;
	const nameTableY = scrolledY % constants.SCREEN_HEIGHT;

	const tileId = ppu.nameTable.getTileIdOf(nameTableId, nameTableX, nameTableY);
	const paletteId = ppu.attributeTable.getPaletteIdOf(
		nameTableId,
		nameTableX,
		nameTableY
	);
	const paletteIndex = ppu.patternTable.getPaletteIndexOf(
		registers.ppuCtrl.patternTableAddressIdForBackground,
		tileId,
		nameTableX % constants.TILE_LENGTH,
		nameTableY % constants.TILE_LENGTH
	);

	const color =
		paletteIndex !== constants.COLOR_TRANSPARENT
			? ppu.framePalette.getColorOf(paletteId, paletteIndex)
			: ppu.framePalette.getColorOf(0, 0);

	ppu.plot(x, y, color);
	ppu.savePaletteIndex(x, y, paletteIndex);
};
