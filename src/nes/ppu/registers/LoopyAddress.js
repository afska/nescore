import constants from "../../constants";

/**
 * A VRAM address, used for fetching the right tile during render.
 * yyy NN YYYYY XXXXX
 * ||| || ||||| +++++-- coarse X scroll
 * ||| || +++++-------- coarse Y scroll
 * ||| ++-------------- nametable select
 * +++----------------- fine Y scroll
 */
export default class LoopyAddress {
	constructor() {
		this.coarseX = 0;
		this.coarseY = 0;
		this.baseNameTableId = 0;
		this.fineY = 0;
	}

	/** Increments X, wrapping when needed. */
	incrementX() {
		let v = this.toNumber();

		// if coarse X === 31
		if ((v & 0x001f) === 31) {
			// coarse X = 0
			v = v & 0xffe0;
			// switch horizontal nametable
			v = v ^ 0x0400;
		} else {
			// increment coarse X
			v++;
		}

		this.update(v);
	}

	/** Increments Y, wrapping when needed. */
	incrementY() {
		let v = this.toNumber();

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

		this.update(v);
	}

	/** Converts the address to a 15-bit number. */
	toNumber() {
		return (
			(this.coarseX << constants.LOOPY_ADDR_COARSE_X_OFFSET) |
			(this.coarseY << constants.LOOPY_ADDR_COARSE_Y_OFFSET) |
			(this.baseNameTableId << constants.LOOPY_ADDR_BASE_NAME_TABLE_ID_OFFSET) |
			(this.fineY << constants.LOOPY_ADDR_FINE_Y_OFFSET)
		);
	}

	/** Updates the address from a 15-bit number. */
	update(number) {
		this.coarseX =
			(number >> constants.LOOPY_ADDR_COARSE_X_OFFSET) &
			constants.LOOPY_ADDR_COARSE_X_MASK;
		this.coarseY =
			(number >> constants.LOOPY_ADDR_COARSE_Y_OFFSET) &
			constants.LOOPY_ADDR_COARSE_Y_MASK;
		this.baseNameTableId =
			(number >> constants.LOOPY_ADDR_BASE_NAME_TABLE_ID_OFFSET) &
			constants.LOOPY_ADDR_BASE_NAME_TABLE_ID_MASK;
		this.fineY =
			(number >> constants.LOOPY_ADDR_FINE_Y_OFFSET) &
			constants.LOOPY_ADDR_FINE_Y_MASK;
	}
}
