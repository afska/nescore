import { getCycleType } from "../constants";
import { interrupts } from "../../cpu/constants";

/** Runs on scanline 241, which starts the VBlank period and can trigger NMIs. */
export default ({ ppu }) => {
	const cycleType = getCycleType(ppu.cycle);

	if (cycleType === "ONE") {
		ppu.registers.ppuStatus.isInVBlankInterval = 1;
		if (ppu.registers.ppuCtrl.generateNmiAtStartOfVBlank) return interrupts.NMI;
	}

	return null;
};
