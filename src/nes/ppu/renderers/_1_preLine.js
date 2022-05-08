import constants from "../../constants";

/** Runs on virtual scanline -1, which prepares the PPU for rendering. */
export default function preLine({ ppu, mapper }) {
	if (ppu.cycle === constants.PPU_CYCLE_CLEAR_FLAGS) {
		const { ppuStatus } = ppu.registers;

		ppuStatus.spriteOverflow = 0;
		ppuStatus.sprite0Hit = 0;
		ppuStatus.isInVBlankInterval = 0;
	}

	return ppu.cycle === constants.PPU_MAPPER_TICK_CYCLE ? mapper.tick() : null;
}
