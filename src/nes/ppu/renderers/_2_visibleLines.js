import renderBackground from "./renderBackground";
import renderSprites from "./renderSprites";
import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default function visibleLine(context) {
	const { ppu } = context;

	if (
		ppu.cycle === constants.PPU_RENDER_BACKGROUND_CYCLE &&
		!!ppu.registers.ppuMask.showBackground
	)
		renderBackground(context);

	if (
		ppu.cycle === constants.PPU_RENDER_SPRITES_CYCLE &&
		!!ppu.registers.ppuMask.showSprites
	)
		renderSprites(context);

	return null;
}
