import { getCycleType } from "../constants";

export default ({ ppu }) => {
	const cycleType = getCycleType(ppu.cycle);

	if (cycleType === "ONE") ppu.registers.ppuStatus.isInVBlankInterval = 0;

	return null;
};
