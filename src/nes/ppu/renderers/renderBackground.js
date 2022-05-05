import constants from "../../constants";

/** Renders the background from the Name tables. */
export default function renderBackground({ ppu }) {
	const { registers } = ppu;
	const y = ppu.scanline;
	const { x: scrollX, y: scrollY } = registers.ppuScroll;

	for (let x = 0; x < constants.SCREEN_WIDTH; x++) {
		const scrolledX = x + scrollX;
		const scrolledY = y + scrollY;

		if (!registers.ppuMask.showBackgroundInLeftmost8PixelsOfScreen && x < 8) {
			const color = ppu.framePalette.getColorOf(0, 0);
			ppu.plot(x, y, color);
			ppu.savePaletteIndex(x, y, 0);
			continue;
		}

		const baseNameTableId = registers.ppuCtrl.baseNameTableId;
		const nameTableId =
			baseNameTableId +
			Math.floor(scrolledX / constants.SCREEN_WIDTH) +
			Math.floor(scrolledY / constants.SCREEN_HEIGHT) *
				constants.NAME_TABLE_MATRIX_LENGTH;
		const nameTableX = scrolledX % constants.SCREEN_WIDTH;
		const nameTableY = scrolledY % constants.SCREEN_HEIGHT;

		const tileId = ppu.nameTable.getTileIdOf(
			nameTableId,
			nameTableX,
			nameTableY
		);
		const paletteId = ppu.attributeTable.getPaletteIdOf(
			nameTableId,
			nameTableX,
			nameTableY
		);

		const tileStartX = nameTableX % constants.TILE_LENGTH;
		const remainingNameTablePixels = constants.SCREEN_WIDTH - nameTableX;
		const tilePixels = Math.min(
			constants.TILE_LENGTH - tileStartX,
			remainingNameTablePixels
		);

		for (let i = 0; i < tilePixels; i++) {
			const paletteIndex = ppu.patternTable.getPaletteIndexOf(
				registers.ppuCtrl.patternTableAddressIdForBackground,
				tileId,
				tileStartX + i,
				nameTableY % constants.TILE_LENGTH
			);

			const color =
				paletteIndex !== constants.COLOR_TRANSPARENT
					? ppu.framePalette.getColorOf(paletteId, paletteIndex)
					: ppu.framePalette.getColorOf(0, 0);

			ppu.plot(x + i, y, color);
			ppu.savePaletteIndex(x + i, y, paletteIndex);
		}

		x += tilePixels - 1;
	}
}
