import { WriteOnlyInMemoryRegister } from "../../registers";
import constants from "../../constants";

/**
 * PPU Scrolling Position Register (>> write twice, first X then Y)
 *
 * Changes the scroll position. Used to tell the PPU which pixel of the Name table
 * (selected through `PPUCtrl`) should be at the top left corner of the rendered screen.
 * Connected to `LoopyRegister`.
 */
export default class PPUScroll extends WriteOnlyInMemoryRegister {
	/**
	 * Returns the scrolled X in Name table coordinates ([0..262]).
	 * If this value overflows (> 255), switch the horizontal Name table.
	 */
	scrolledX(x) {
		const { vAddress, fineX } = this.context.ppu.loopy;

		return (
			vAddress.coarseX * constants.TILE_LENGTH +
			fineX +
			(x % constants.TILE_LENGTH)
		);
	}

	/** Returns the scrolled X in Name table coordinates ([0..255]). */
	scrolledY() {
		const { vAddress } = this.context.ppu.loopy;

		return vAddress.coarseY * constants.TILE_LENGTH + vAddress.fineY;
	}

	/** Alternately writes the X and the Y coordinates of the scroll. */
	writeAt(__, byte) {
		this.context.ppu.loopy.onPPUScrollWrite(byte);
	}
}
