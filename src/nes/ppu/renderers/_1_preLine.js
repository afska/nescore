import constants from "../../constants";

/** Runs on virtual scanline -1, which prepares the PPU for rendering. */
export default ({ ppu }) => {
	if (ppu.cycle === constants.PPU_CYCLE_CLEAR_FLAGS)
		ppu.registers.ppuStatus.isInVBlankInterval = 0;

	return null;
};
