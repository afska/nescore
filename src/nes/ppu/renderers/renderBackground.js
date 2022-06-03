import constants from "../../constants";

const NAME_TABLE_OFFSETS = [1, -1, 1, -1]; // (for `scrolledX` overflow)

/** Renders the background from the Name tables. */
export default function renderBackground({ ppu }) {
	if (ppu.cycle === 0) return ppu.loopy.onVisibleLine(0);

	const { registers } = ppu;
	const y = ppu.scanline;

	for (let x = 0; x < constants.SCREEN_WIDTH; x++) {
		const cycle = x + 1;
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
		const baseNameTableId = registers.ppuCtrl.nameTableId;
		const nameTableOffset = // (switch horizontal Name table if scrolledX has overflowed)
			scrolledX >= constants.SCREEN_WIDTH
				? NAME_TABLE_OFFSETS[baseNameTableId]
				: 0;
		const nameTableId = baseNameTableId + nameTableOffset;
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
		const tilePixels = Math.min(
			constants.TILE_LENGTH - tileStartX,
			remainingNameTablePixels
		);
		for (let i = 0; i < tilePixels; i++) {
			const paletteIndex = ppu.patternTable.getPaletteIndexFromBytes(
				patternLowByte,
				patternHighByte,
				tileStartX + i
			);

			const color =
				paletteIndex !== constants.COLOR_TRANSPARENT
					? ppu.framePalette.getColorOf(paletteId, paletteIndex)
					: ppu.framePalette.getColorOf(0, 0);

			ppu.plot(x + i, y, color);
			ppu.savePaletteIndex(x + i, y, paletteIndex);
			ppu.loopy.onVisibleLine(cycle + i);
		}

		// (the x++ of the for loop will do the last increment)
		x += tilePixels - 1;
	}
}
