import renderBackground from "./renderBackground";
import renderSprites from "./renderSprites";
import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default function visibleLine(context) {
	const { ppu, mapper } = context;
	if (!ppu.registers.ppuMask.isRenderingEnabled) return null; // TODO: REMOVE IS RENDERING CHECKS

	if (
		// ppu.cycle === constants.PPU_RENDER_BACKGROUND_CYCLE &&
		ppu.registers.ppuMask.showBackground
	)
		renderBackground(context);

	if (
		ppu.cycle === constants.PPU_RENDER_SPRITES_CYCLE &&
		ppu.registers.ppuMask.showSprites
	)
		renderSprites(context);

	// visible, or prefetch
	if (
		((ppu.cycle >= 8 && ppu.cycle <= 256) ||
			(ppu.cycle >= 328 && ppu.cycle <= 336)) &&
		ppu.cycle % 8 === 0
	) {
		ppu.registers.ppuScroll.updateX();
	}

	if (ppu.cycle === 256) ppu.registers.ppuScroll.updateY();
	if (ppu.cycle === 257) ppu.registers.ppuScroll.copyX();

	return ppu.cycle === constants.PPU_MAPPER_TICK_CYCLE ? mapper.tick() : null;
}
