import { InMemoryRegister } from "../../registers";

/**
 * PPU Scrolling Position Register (>> write twice, first X then Y)
 *
 * Changes the scroll position. Used to tell the PPU which pixel of the Name table
 * (selected through `PPUCtrl`) should be at the top left corner of the rendered screen.
 * It uses `PPUAddr`'s latch.
 */
export default class PPUScroll extends InMemoryRegister {
	/** When a context is loaded. */
	onLoad() {
		this.x = 0;
		this.y = 0;
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Alternately writes the X and the Y coordinates of the scroll. */
	writeAt(__, byte) {
		const { ppuAddr } = this.context.ppu.registers;

		if (!ppuAddr.latch) this.x = byte;
		else this.y = byte;

		ppuAddr.latch = !ppuAddr.latch;
	}
}
