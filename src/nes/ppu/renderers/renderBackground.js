import constants from "../../constants";

const NAMETABLE_ID = 0;

/** Renders the background from the Name tables. */
export default ({ ppu }) => {
	const y = ppu.scanline;

	for (let i = 0; i < constants.PPU_RENDER_FREQUENCY; i++) {
		let x = ppu.cycle + i;

		const tileId = ppu.nameTable.getTileIdOf(NAMETABLE_ID, x, y);
		const paletteId = ppu.attributeTable.getPaletteIdOf(NAMETABLE_ID, x, y);
		const paletteIndex = ppu.patternTable.getPaletteIndexOf(
			ppu.registers.ppuCtrl.patternTableAddressIdForBackground,
			tileId,
			x % constants.TILE_LENGTH,
			y % constants.TILE_LENGTH
		);
		const color = ppu.framePalette.getColorOf(paletteId, paletteIndex);

		ppu.plot(x, y, color);
	}
};
