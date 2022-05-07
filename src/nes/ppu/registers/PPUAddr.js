import { InMemoryRegister } from "../../registers";
import constants from "../../constants";
import { Byte } from "../../helpers";

/**
 * PPU Address Register (>> write twice, upper byte first)
 *
 * Write the PPU address you want to access here, then write in `PPUData`.
 *
 * This address is connected to the scrolling metadata.
 * yyy NN YYYYY XXXXX
 * ||| || ||||| +++++-- coarse X scroll
 * ||| || +++++-------- coarse Y scroll
 * ||| ++-------------- nametable select
 * +++----------------- fine Y scroll
 */
export default class PPUAddr extends InMemoryRegister {
	/** When a context is loaded. */
	onLoad() {
		this.address = 0;
		this.latch = false;
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/**
	 * Alternately writes the MSB and the LSB of the address.
	 * This also affects the scrolling metadata.
	 */
	writeAt(__, byte) {
		this.address = !this.latch
			? Byte.to16Bit(byte, Byte.lowPartOf(this.address))
			: Byte.to16Bit(Byte.highPartOf(this.address), byte);

		// (writing `PPUAddr` affects `PPUScroll` in a weird way)
		this._updateScrollingMetadata(byte);

		this.latch = !this.latch;
	}

	_updateScrollingMetadata(byte) {
		const { ppuCtrl, ppuScroll } = this.context.ppu.registers;

		let coarseX = Math.floor(ppuScroll.x / constants.TILE_LENGTH);
		let fineX = ppuScroll.x % constants.TILE_LENGTH;
		let coarseY = Math.floor(ppuScroll.y / constants.TILE_LENGTH);
		let fineY = ppuScroll.y % constants.TILE_LENGTH;

		if (!this.latch) {
			// Loopy $2006 first write (w is 0)
			// t: .CDEFGH ........ <- d: ..CDEFGH
			//        <unused>     <- d: AB......
			// t: Z...... ........ <- 0 (bit Z is cleared)
			// w:                  <- 1

			const baseNameTableId = Byte.getSubNumber(byte, 2, 2); // EF
			coarseY = Byte.setSubNumber(coarseY, 3, 2, Byte.getSubNumber(byte, 0, 2)); // GH
			fineY = Byte.getSubNumber(byte, 4, 2);

			ppuCtrl.baseNameTableId = baseNameTableId;
		} else {
			// Loopy $2006 second write (w is 1)
			// t: ....... ABCDEFGH <- d: ABCDEFGH
			// v: <...all bits...> <- t: <...all bits...>
			// w:                  <- 0

			coarseX = Byte.getSubNumber(byte, 0, 5); // DEFGH
			coarseY = Byte.setSubNumber(coarseY, 0, 3, Byte.getSubNumber(byte, 5, 3)); // ABC
		}

		ppuScroll.x = coarseX * constants.TILE_LENGTH + fineX;
		ppuScroll.y = coarseY * constants.TILE_LENGTH + fineY;
	}
}
