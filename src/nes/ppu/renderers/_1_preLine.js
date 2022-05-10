import constants from "../../constants";

/** Runs on virtual scanline -1, which prepares the PPU for rendering. */
export default function preLine({ ppu, mapper }) {
	if (!ppu.registers.ppuMask.isRenderingEnabled) return null; // TODO: REMOVE IS RENDERING CHECKS

	if (ppu.cycle === constants.PPU_CYCLE_CLEAR_FLAGS) {
		const { ppuStatus } = ppu.registers;

		ppuStatus.spriteOverflow = 0;
		ppuStatus.sprite0Hit = 0;
		ppuStatus.isInVBlankInterval = 0;
	}

	if (ppu.cycle >= 280 && ppu.cycle <= 304) {
		// COPY_Y
		// https://wiki.nesdev.com/w/index.php/PPU_scrolling#During_dots_280_to_304_of_the_pre-render_scanline_.28end_of_vblank.29
		ppu.registers.ppuScroll.copyY();
	}

	if (ppu.cycle === 256) ppu.registers.ppuScroll.updateY();
	if (ppu.cycle === 257) ppu.registers.ppuScroll.copyX();

	return ppu.cycle === constants.PPU_MAPPER_TICK_CYCLE ? mapper.tick() : null;
}
