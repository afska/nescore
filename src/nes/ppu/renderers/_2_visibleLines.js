import renderBackground from "./renderBackground";
import renderSprites from "./renderSprites";
import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default (context) => {
	const { ppu } = context;

	if (
		ppu.cycle < constants.SCREEN_WIDTH &&
		!!ppu.registers.ppuMask.showBackground
	)
		renderBackground(context);

	if (
		ppu.cycle === constants.PPU_LAST_CYCLE &&
		!!ppu.registers.ppuMask.showSprites
	)
		renderSprites(context);

	return null;
};
