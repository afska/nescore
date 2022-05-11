import constants from "../../constants";

/** Renders the background from the Name tables. */
export default function renderBackground({ ppu }) {
	if (ppu.cycle === 0) return ppu.loopy.onVisibleLine(0);

	const { registers } = ppu;
	const y = ppu.scanline;

	for (let x = 0; x < 1; x++) {
		const cycle = ppu.cycle;
		const x = cycle - 1;
		const scrolledX = registers.ppuScroll.scrolledX(x);
		const scrolledY = registers.ppuScroll.scrolledY();

		// skip masked pixels
		if (!registers.ppuMask.showBackgroundInLeftmost8PixelsOfScreen && x < 8) {
			const color = ppu.framePalette.getColorOf(0, 0);
			ppu.plot(x, y, color);
			ppu.savePaletteIndex(x, y, 0);
			ppu.loopy.onVisibleLine(cycle);
			continue;
		}

		// background coordinates based on scroll
		const baseNameTableId = registers.ppuCtrl.baseNameTableId;
		const nameTableId =
			baseNameTableId +
			Math.floor(scrolledX / constants.SCREEN_WIDTH) +
			Math.floor(scrolledY / constants.SCREEN_HEIGHT) *
				constants.NAME_TABLE_MATRIX_LENGTH;
		const nameTableX = scrolledX % constants.SCREEN_WIDTH;
		const nameTableY = scrolledY % constants.SCREEN_HEIGHT;

		// tile id and palette id
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

		// tile row fetch
		const patternTableId = registers.ppuCtrl.patternTableAddressIdForBackground;
		const tileStartX = nameTableX % constants.TILE_LENGTH;
		const tileStartY = nameTableY % constants.TILE_LENGTH;
		const patternLowByte = ppu.patternTable.getLowByteOf(
			patternTableId,
			tileId,
			tileStartY
		);
		const patternHighByte = ppu.patternTable.getHighByteOf(
			patternTableId,
			tileId,
			tileStartY
		);

		// partially draw tile (from `tileStartX` until its end or the end of the Name table)
		const remainingNameTablePixels = constants.SCREEN_WIDTH - nameTableX;
		const tilePixels = 1; /*Math.min(
			constants.TILE_LENGTH - tileStartX,
			remainingNameTablePixels
		);*/
		for (let i = 0; i < tilePixels; i++) {
			const finalX = x + i;

			// color fetch
			const paletteIndex = ppu.patternTable.getPaletteIndexFromBytes(
				patternLowByte,
				patternHighByte,
				tileStartX + i
			);
			const isOpaque = paletteIndex !== constants.COLOR_TRANSPARENT;
			const color = isOpaque
				? ppu.framePalette.getColorOf(paletteId, paletteIndex)
				: ppu.framePalette.getColorOf(0, 0);

			// sprite 0 hit
			if (isOpaque && ppu.sprite0HitPixels.includes(finalX))
				registers.ppuStatus.sprite0Hit = 1;

			// actual drawing
			ppu.plot(finalX, y, color);
			ppu.savePaletteIndex(finalX, y, paletteIndex);
			ppu.loopy.onVisibleLine(cycle + i);
		}

		// (the x++ of the for loop will do the last increment)
		// x += tilePixels - 1;
	}
}
