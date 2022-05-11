import renderBackground from "./renderBackground";
import renderSprites from "./renderSprites";
import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default function visibleLines(context) {
	const { ppu, mapper } = context;
	if (!ppu.registers.ppuMask.isRenderingEnabled) return null;

	if (
		ppu.cycle === constants.PPU_CYCLE_RENDER_BACKGROUND &&
		ppu.registers.ppuMask.showBackground
	)
		renderBackground(context);

	if (
		ppu.cycle === constants.PPU_CYCLE_RENDER_SPRITES &&
		ppu.registers.ppuMask.showSprites
	)
		renderSprites(context);

	ppu.loopy.onLine(ppu.cycle);

	return ppu.cycle === constants.PPU_CYCLE_MAPPER_TICK ? mapper.tick() : null;
}
