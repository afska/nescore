import renderBackground from "./renderBackground";
import renderSprites from "./renderSprites";
import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default function visibleLines(context) {
	const { ppu, mapper } = context;
	if (!ppu.registers.ppuMask.isRenderingEnabled) return null;

	if (
		ppu.cycle <= constants.SCREEN_WIDTH &&
		ppu.registers.ppuMask.showBackground
	)
		renderBackground(context);

	if (
		ppu.cycle === constants.PPU_RENDER_SPRITES_CYCLE &&
		ppu.registers.ppuMask.showSprites
	)
		renderSprites(context);

	ppu.loopy.onVisibleLine(ppu.cycle);

	return ppu.cycle === constants.PPU_MAPPER_TICK_CYCLE ? mapper.tick() : null;
}
