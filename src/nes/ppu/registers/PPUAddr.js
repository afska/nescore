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

	/** Alternately writes the MSB and the LSB of the address, and updates scrolling metadata. */
	writeAt(__, byte) {
		this.address = this.latch
			? Byte.to16Bit(Byte.highPartOf(this.address), byte)
			: Byte.to16Bit(byte, Byte.lowPartOf(this.address));

		this._updateLoopyRegisters(byte);

		this.latch = !this.latch;
	}

	_updateLoopyRegisters(byte) {
		const { ppuScroll } = this.context.ppu.registers;

		if (!this.latch) {
			// Loopy $2006 first write (w is 0)
			// t: .CDEFGH ........ <- d: ..CDEFGH
			//        <unused>     <- d: AB......
			// t: Z...... ........ <- 0 (bit Z is cleared)
			// w:                  <- 1

			let number = ppuScroll.tAddress.toNumber();
			let high = Byte.highPartOf(number);
			high = Byte.setSubNumber(high, 0, 6, Byte.getSubNumber(byte, 0, 6));
			high = Byte.setSubNumber(high, 7, 1, 0);
			number = Byte.to16Bit(high, Byte.lowPartOf(number));
			ppuScroll.tAddress.fromNumber(number);
		} else {
			// Loopy $2006 second write (w is 1)
			// t: ....... ABCDEFGH <- d: ABCDEFGH
			// v: <...all bits...> <- t: <...all bits...>
			// w:                  <- 0

			let number = ppuScroll.tAddress.toNumber();
			number = Byte.to16Bit(Byte.highPartOf(number), byte);
			ppuScroll.tAddress.fromNumber(number);
			ppuScroll.vAddress.fromNumber(number);
		}
	}
}
