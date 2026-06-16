import constants from "../../constants";
import { interrupts } from "../../cpu/constants";

/** Runs on scanline 241, which starts the VBlank period and can trigger NMIs. */
export default function vBlankLine({ ppu }) {
	if (ppu.cycle === constants.PPU_CYCLE_VBLANK - 1) {
		ppu.registers.ppuStatus.isInVBlankInterval = 1;
		// some games with tight loops (like Bomberman) need to "see" the VBlank flag before jumping to the NMI handler
		return constants.BREAK_FLAG;
	}

	if (ppu.cycle === constants.PPU_CYCLE_VBLANK) {
		ppu.registers.ppuStatus.isInVBlankInterval = 1;
		if (ppu.registers.ppuCtrl.generateNmiAtStartOfVBlank) return interrupts.NMI;
	}

	return null;
}
