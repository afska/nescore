import { InMemoryRegister } from "../../registers";
import constants from "../../constants";

/**
 * PPU Scrolling Position Register (>> write twice, first X then Y)
 *
 * Changes the scroll position. Used to tell the PPU which pixel of the Name table
 * (selected through `PPUCtrl`) should be at the top left corner of the rendered screen.
 * Connected to `LoopyRegister`.
 */
export default class PPUScroll extends InMemoryRegister {
	/** Returns the scrolled X. */
	scrolledX(x) {
		const { vAddress, fineX } = this.context.ppu.loopy;

		return (
			vAddress.coarseX * constants.TILE_LENGTH +
			fineX +
			(x % constants.TILE_LENGTH)
		);
	}

	/** Returns the scrolled Y. */
	scrolledY() {
		const { vAddress } = this.context.ppu.loopy;

		return vAddress.coarseY * constants.TILE_LENGTH + vAddress.fineY;
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Alternately writes the X and the Y coordinates of the scroll. */
	writeAt(__, byte) {
		this.context.ppu.loopy.onPPUScrollWrite(byte);
	}
}
