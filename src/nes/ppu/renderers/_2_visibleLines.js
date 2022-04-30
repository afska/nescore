import renderBackground from "./renderBackground";
import renderSprites from "./renderSprites";
import constants from "../../constants";

/** Runs for each visible scanline. Renders the image. */
export default (context) => {
	const { ppu } = context;

	if (
		ppu.cycle < constants.SCREEN_WIDTH &&
		ppu.cycle % constants.PPU_RENDER_FREQUENCY === 0
	) {
		renderBackground(context);
	}

	if (ppu.cycle === constants.PPU_CYCLE_RENDER_SPRITES) {
		renderSprites(context);
	}
};
