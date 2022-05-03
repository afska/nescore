import LoopyAddress from "./LoopyAddress";
import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";

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
		this.vAddress = new LoopyAddress(); // v
		this.tAddress = new LoopyAddress(); // t
		this.fineX = 0; //                     x
		// w = `PPUAddr`'s latch
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Alternately writes the X and the Y coordinates of the scroll. */
	writeAt(__, byte) {
		const { ppuAddr } = this.context.ppu.registers;

		if (ppuAddr.latch) {
			// Loopy $2005 second write (w is 1)
			// t: FGH..AB CDE..... <- d: ABCDEFGH
			// w:                  <- 0

			let number = this.tAddress.toNumber();
			let high = Byte.highPartOf(number);
			let low = Byte.lowPartOf(number);
			low = Byte.setSubNumber(low, 5, 3, Byte.getSubNumber(byte, 3, 3));
			high = Byte.setSubNumber(high, 0, 2, Byte.getSubNumber(byte, 6, 2));
			high = Byte.setSubNumber(high, 4, 3, Byte.getSubNumber(byte, 0, 3));
			number = Byte.to16Bit(high, low);
			this.tAddress.fromNumber(number);
		} else {
			// Loopy $2005 first write (w is 0)
			// t: ....... ...ABCDE <- d: ABCDE...
			// x:              FGH <- d: .....FGH
			// w:                  <- 1

			this.tAddress.coarseX = Byte.getSubNumber(byte, 3, 5);
			this.fineX = Byte.getSubNumber(byte, 0, 3);
		}

		ppuAddr.latch = !ppuAddr.latch;
	}
}
