import constants from "../../constants";

let counter = 0;

/** Renders the background from the Name tables. */
export default function renderBackground({ ppu }) {
	const { registers } = ppu;
	const y = ppu.scanline;
	const { vAddress, fineX } = ppu.registers.ppuScroll;

	if (ppu.cycle === 0) return;

	for (let xxx = 0; xxx < 1 /*constants.SCREEN_WIDTH*/; xxx++) {
		const x = ppu.cycle - 1;
		const scrollX = vAddress.coarseX * constants.TILE_LENGTH + fineX;
		const scrollY = vAddress.coarseY * constants.TILE_LENGTH + vAddress.fineY;
		const scrolledX = Math.max(0, scrollX + (x % 8) - 16);
		const scrolledY = scrollY; // (ya contiene y)

		counter++;
		// if (counter % 1 === 0) {
		// console.log(
		// 	"LINE:",
		// 	ppu.scanline,
		// 	"X:",
		// 	x,
		// 	"SCROLLX",
		// 	scrollX,
		// 	"SCROLLY",
		// 	scrollY
		// );
		// debugger;
		// }

		// skip masked pixels
		if (!registers.ppuMask.showBackgroundInLeftmost8PixelsOfScreen && x < 8) {
			const color = ppu.framePalette.getColorOf(0, 0);
			ppu.plot(x, y, color);
			ppu.savePaletteIndex(x, y, 0);
			continue;
		}

		// background coordinates based on scroll
		const baseNameTableId = vAddress.baseNameTableId;
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
		}

		// (the x++ of the for loop will do the last increment)
		// x += tilePixels - 1;
	}
}
