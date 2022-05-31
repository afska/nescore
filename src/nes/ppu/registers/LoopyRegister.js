import LoopyAddress from "./LoopyAddress";
import { Byte } from "../../helpers";

/**
 * PPU's internal register (discovered by a user called `loopy` on nesdev).
 * It contains important data related to Name table scrolling.
 * Every write to `PPUAddr`, `PPUScroll`, and `PPUCtrl` changes its state.
 * It's also changed multiple times by the PPU during render.
 */
export default class LoopyRegister {
	constructor() {
		this.vAddress = new LoopyAddress(); // v (current VRAM address)
		this.tAddress = new LoopyAddress(); // t (temporary VRAM address)
		this.fineX = 0; //                     x (fine X scroll)
		this.latch = false; //                 w (first or second write toggle)
	}

	/** Executed on `PPUCtrl` writes (updates `nameTableId` of `t`). */
	onPPUCtrlWrite(byte) {
		// $2000 write
		// t: ...GH.. ........ <- d: ......GH
		//    <used elsewhere> <- d: ABCDEF..
		this.tAddress.nameTableId = Byte.getSubNumber(byte, 0, 2);
	}

	/** Executed on `PPUStatus` reads (resets `latch`). */
	onPPUStatusRead() {
		// $2002 read
		// w:                  <- 0
		this.latch = false;
	}

	/** Executed on `PPUScroll` writes (updates X and Y scrolling on `t`). */
	onPPUScrollWrite(byte) {
		if (!this.latch) {
			// $2005 first write (w is 0)
			// t: ....... ...ABCDE <- d: ABCDE...
			// x:              FGH <- d: .....FGH
			// w:                  <- 1

			this.tAddress.coarseX = Byte.getSubNumber(byte, 3, 5);
			this.fineX = Byte.getSubNumber(byte, 0, 3);
		} else {
			// $2005 second write (w is 1)
			// t: FGH..AB CDE..... <- d: ABCDEFGH
			// w:                  <- 0

			this.tAddress.coarseY = Byte.getSubNumber(byte, 3, 5);
			this.tAddress.fineY = Byte.getSubNumber(byte, 0, 3);
		}

		this.latch = !this.latch;
	}

	/** Executed on `PPUAddr` writes (updates everything in a weird way, copying `t` to `v`). */
	onPPUAddrWrite(byte) {
		if (!this.latch) {
			// $2006 first write (w is 0)
			// t: .CDEFGH ........ <- d: ..CDEFGH
			//        <unused>     <- d: AB......
			// t: Z...... ........ <- 0 (bit Z is cleared)
			// w:                  <- 1

			let number = this.tAddress.toNumber();
			let high = Byte.highPartOf(number);
			high = Byte.setSubNumber(high, 0, 6, Byte.getSubNumber(byte, 0, 6));
			high = Byte.setSubNumber(high, 6, 1, 0);
			number = Byte.to16Bit(high, Byte.lowPartOf(number));
			this.tAddress.update(number);
		} else {
			// $2006 second write (w is 1)
			// t: ....... ABCDEFGH <- d: ABCDEFGH
			// v: <...all bits...> <- t: <...all bits...>
			// w:                  <- 0

			let number = this.tAddress.toNumber();
			number = Byte.to16Bit(Byte.highPartOf(number), byte);
			this.tAddress.update(number);
			this.vAddress.update(number);
		}

		this.latch = !this.latch;
	}

	/** Executed multiple times for each pre line. */
	onPreLine(cycle) {
		/**
		 * During dots 280 to 304 of the pre-render scanline (end of vblank)
		 * If rendering is enabled, at the end of vblank, shortly after the horizontal bits are copied
		 * from t to v at dot 257, the PPU will repeatedly copy the vertical bits from t to v from
		 * dots 280 to 304, completing the full initialization of v from t.
		 */
		if (cycle >= 280 && cycle <= 304) this._copyY();
	}

	/** Executed multiple times for each visible line (prefetch dots were ignored). */
	onVisibleLine(cycle) {
		/**
		 * Between dot 328 of a scanline, and 256 of the next scanline
		 * If rendering is enabled, the PPU increments the horizontal position in v many times
		 * across the scanline, it begins at dots 328 and 336, and will continue through the next
		 * scanline at 8, 16, 24... 240, 248, 256 (every 8 dots across the scanline until 256).
		 * Across the scanline the effective coarse X scroll coordinate is incremented repeatedly,
		 * which will also wrap to the next nametable appropriately.
		 */
		if (cycle >= 8 && cycle <= 256 && cycle % 8 === 0)
			this.vAddress.incrementX();
	}

	/** Executed multiple times for each line. */
	onLine(cycle) {
		/**
		 * At dot 256 of each scanline
		 * If rendering is enabled, the PPU increments the vertical position in v. The effective Y
		 * scroll coordinate is incremented, which is a complex operation that will correctly skip
		 * the attribute table memory regions, and wrap to the next nametable appropriately.
		 */
		if (cycle === 256) this.vAddress.incrementY();

		/**
		 * At dot 257 of each scanline
		 * If rendering is enabled, the PPU copies all bits related to horizontal position from t to v.
		 */
		if (cycle === 257) this._copyX();
	}

	_copyX() {
		// (copies all bits related to horizontal position from `t` to `v`)
		const v = this.vAddress.toNumber();
		const t = this.tAddress.toNumber();

		// v: ....A.. ...BCDEF <- t: ....A.. ...BCDEF
		this.vAddress.update((v & 0b111101111100000) | (t & 0b000010000011111));
	}

	_copyY() {
		// (copies all bits related to vertical position from `t` to `v`)
		const v = this.vAddress.toNumber();
		const t = this.tAddress.toNumber();

		// v: GHIA.BC DEF..... <- t: GHIA.BC DEF.....
		this.vAddress.update((v & 0b000010000011111) | (t & 0b111101111100000));
	}
}
