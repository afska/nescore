import constants from "../../constants";

const NAME_TABLE_OFFSETS = [1, -1, 1, -1]; // (for `scrolledX` overflow)
const FULL_ALPHA = 0xff000000;

/** Renders the background from the Name tables. */
export default function renderBackground({ ppu }) {
	const { registers, loopy } = ppu;
	const y = ppu.scanline;

	const scrolledY = registers.ppuScroll.scrolledY();
	const transparentColor = ppu.framePalette.getColorOf(0, 0);

	for (let x = 0; x < constants.SCREEN_WIDTH; x++) {
		const cycle = x + 1;
		const scrolledX = registers.ppuScroll.scrolledX(x);

		const showBackground = registers.ppuMask.showBackground;
		const shouldSkip =
			!showBackground ||
			(!registers.ppuMask.showBackgroundInLeftmost8PixelsOfScreen && x < 8);

		// skip masked pixels
		if (shouldSkip) {
			ppu.frameBuffer[y * constants.SCREEN_WIDTH + x] =
				FULL_ALPHA | registers.ppuMask.transform(transparentColor);
			ppu.paletteIndexes[y * constants.SCREEN_WIDTH + x] = 0;
			if (showBackground) loopy.onVisibleLine(cycle);
			continue;
		}

		// background coordinates based on scroll
		const baseNameTableId = loopy.vAddress.nameTableId;
		const nameTableOffset = // (switch horizontal Name table if scrolledX has overflowed)
			scrolledX >= constants.SCREEN_WIDTH
				? NAME_TABLE_OFFSETS[baseNameTableId]
				: 0;
		const nameTableId = baseNameTableId + nameTableOffset;
		const nameTableX = scrolledX % constants.SCREEN_WIDTH;
		const nameTableY = scrolledY % constants.SCREEN_HEIGHT;

		// tile id and palette fetch
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
		const paletteColors = [
			ppu.framePalette.getColorOf(paletteId, 0),
			ppu.framePalette.getColorOf(paletteId, 1),
			ppu.framePalette.getColorOf(paletteId, 2),
			ppu.framePalette.getColorOf(paletteId, 3)
		];

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
					? paletteColors[paletteIndex]
					: transparentColor;

			ppu.frameBuffer[y * constants.SCREEN_WIDTH + x + i] =
				FULL_ALPHA | registers.ppuMask.transform(color);
			ppu.paletteIndexes[y * constants.SCREEN_WIDTH + x + i] = paletteIndex;
			loopy.onVisibleLine(cycle + i);
		}

		// (the x++ of the for loop will do the last increment)
		x += tilePixels - 1;
	}
}
