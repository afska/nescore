import palette from "../../constants/palette";
import constants from "../../../constants";
import { WithContext } from "../../../helpers";

/**
 * An area of memory which defines eight 4-color palettes (4 for backgrounds, 4 for sprites).
 * It's located at $3F00 (Palette RAM), and its total size is 32 bytes.
 * Each byte is an index to the system palette (0x00 ~ 0x3f).
 */
export default class FramePalette {
	constructor() {
		WithContext.apply(this);
	}

	/** Returns the BGR color of `paletteIndex` from `paletteId`. */
	getColorOf(paletteId, paletteIndex) {
		const startAddress =
			constants.PPU_ADDRESSED_PALETTE_RAM_START_ADDRESS +
			paletteId * constants.PALETTE_SIZE;

		const colorIndex = this.context.ppu.memory.readAt(
			startAddress + paletteIndex
		);
		return palette[colorIndex];
	}
}
