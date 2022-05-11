import renderBackground from "./renderBackground";
import renderSprites, { fetchSprite0HitPixels } from "./renderSprites";
import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default function visibleLines(context) {
	const { ppu, mapper } = context;
	if (!ppu.registers.ppuMask.isRenderingEnabled) return null;

	if (
		ppu.cycle === constants.PPU_EVALUATE_SPRITE_0_HIT_CYCLE &&
		ppu.registers.ppuMask.showSprites
	)
		fetchSprite0HitPixels(context);

	if (
		ppu.cycle <= 256 &&
		//ppu.cycle === constants.PPU_RENDER_BACKGROUND_CYCLE &&
		ppu.registers.ppuMask.showBackground
	)
		renderBackground(context);

	if (
		ppu.cycle === constants.PPU_RENDER_SPRITES_CYCLE &&
		ppu.registers.ppuMask.showSprites
	)
		renderSprites(context);

	ppu.loopy.onLine(ppu.cycle);

	return ppu.cycle === constants.PPU_MAPPER_TICK_CYCLE ? mapper.tick() : null;
}
