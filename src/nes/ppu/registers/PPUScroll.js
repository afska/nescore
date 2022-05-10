import LoopyAddress from "./LoopyAddress";
import { InMemoryRegister } from "../../registers";
import { Byte } from "../../helpers";
import constants from "../../constants";

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

	copyX() {
		// https://wiki.nesdev.com/w/index.php/PPU_scrolling#At_dot_257_of_each_scanline
		const v = this.context.ppu.registers.ppuScroll.vAddress.toNumber();
		const t = this.context.ppu.registers.ppuScroll.tAddress.toNumber();
		this.context.ppu.registers.ppuScroll.vAddress.fromNumber(
			(v & 0xfbe0) | (t & 0x041f)
		);
	}

	copyY() {
		// // https://wiki.nesdev.com/w/index.php/PPU_scrolling#During_dots_280_to_304_of_the_pre-render_scanline_.28end_of_vblank.29
		const v = this.context.ppu.registers.ppuScroll.vAddress.toNumber();
		const t = this.context.ppu.registers.ppuScroll.tAddress.toNumber();
		this.context.ppu.registers.ppuScroll.vAddress.fromNumber(
			(v & 0x841f) | (t & 0x7be0)
		);
	}

	updateX() {
		// https://wiki.nesdev.com/w/index.php/PPU_scrolling#Coarse_X_increment
		// increment hori(v)
		// if coarse X === 31

		// return;

		let v = this.context.ppu.registers.ppuScroll.vAddress.toNumber();
		if ((v & 0x001f) === 31) {
			// coarse X = 0
			v = v & 0xffe0;
			// switch horizontal nametable
			v = v ^ 0x0400;
		} else {
			// increment coarse X
			v++;
		}
		this.context.ppu.registers.ppuScroll.vAddress.fromNumber(v);
	}

	updateY() {
		// This one really is a mess
		// Values are coming from nesdev, don't touch, don't break

		// return;

		let v = this.context.ppu.registers.ppuScroll.vAddress.toNumber();

		// INCREMENT_Y
		// https://wiki.nesdev.com/w/index.php/PPU_scrolling#Y_increment
		// increment vert(v)
		// if fine Y < 7
		if ((v & 0x7000) !== 0x7000) {
			// increment fine Y
			v += 0x1000;
		} else {
			// fine Y = 0
			v = v & 0x8fff;
			// let y = coarse Y
			let y = (v & 0x03e0) >> 5;
			if (y === 29) {
				// coarse Y = 0
				y = 0;
				// switch vertical nametable
				v = v ^ 0x0800;
			} else if (y === 31) {
				// coarse Y = 0, nametable not switched
				y = 0;
			} else {
				// increment coarse Y
				y++;
			}
			// put coarse Y back into v
			v = (v & 0xfc1f) | (y << 5);
		}

		this.context.ppu.registers.ppuScroll.vAddress.fromNumber(v);
	}

	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}

	/** Alternately writes the X and the Y coordinates of the scroll. */
	writeAt(__, byte) {
		const { ppuAddr } = this.context.ppu.registers;

		if (!ppuAddr.latch) {
			// Loopy $2005 first write (w is 0)
			// t: ....... ...ABCDE <- d: ABCDE...
			// x:              FGH <- d: .....FGH
			// w:                  <- 1

			this.tAddress.coarseX = Byte.getSubNumber(byte, 3, 5);
			this.fineX = Byte.getSubNumber(byte, 0, 3);
		} else {
			// Loopy $2005 second write (w is 1)
			// t: FGH..AB CDE..... <- d: ABCDEFGH
			// w:                  <- 0

			this.tAddress.coarseY = Byte.getSubNumber(byte, 3, 5);
			this.tAddress.fineY = Byte.getSubNumber(byte, 0, 3);
		}

		ppuAddr.latch = !ppuAddr.latch;
	}
}
