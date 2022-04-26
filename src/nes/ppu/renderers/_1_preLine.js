import { getCycleType } from "../constants";

/** Runs on virtual scanline -1, which prepares the PPU for rendering. */
export default ({ ppu }) => {
	const cycleType = getCycleType(ppu.cycle);

	if (cycleType === "ONE") ppu.registers.ppuStatus.isInVBlankInterval = 0;

	return null;
};
