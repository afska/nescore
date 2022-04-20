import { getCycleType } from "../constants";
import { interrupts } from "../../cpu/constants";

export default ({ ppu, cpu }) => {
	const cycleType = getCycleType(ppu.cycle);

	if (cycleType === "ONE") {
		ppu.registers.ppuStatus.isInVBlankInterval = 1;
		if (ppu.registers.ppuCtrl.generateNmiAtStartOfVBlank) return interrupts.NMI;
	}

	return null;
};
