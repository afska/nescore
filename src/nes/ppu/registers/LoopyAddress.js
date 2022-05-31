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
		this.nameTableId = 0;
		this.fineY = 0;
	}

	/** Increments X, wrapping when needed. */
	incrementX() {
		if (this.coarseX === 31) {
			this.coarseX = 0;
			this._switchHorizontalNameTable();
		} else {
			this.coarseX++;
		}
	}

	/** Increments Y, wrapping when needed. */
	incrementY() {
		if (this.fineY < 7) {
			this.fineY++;
		} else {
			this.fineY = 0;

			if (this.coarseY === 29) {
				this.coarseY = 0;
				this._switchVerticalNameTable();
			} else if (this.coarseY === 31) {
				this.coarseY = 0;
			} else {
				this.coarseY++;
			}
		}
	}

	/**
	 * Returns the value as a 14-bit number.
	 * The v register has 15 bits, but the PPU memory space is only 14 bits wide.
	 * The highest bit is unused for access through $2007.
	 */
	to14BitNumber() {
		return this.toNumber() & 0b11111111111111;
	}

	/** Converts the address to a 15-bit number. */
	toNumber() {
		return (
			(this.coarseX << constants.LOOPY_ADDR_COARSE_X_OFFSET) |
			(this.coarseY << constants.LOOPY_ADDR_COARSE_Y_OFFSET) |
			(this.nameTableId << constants.LOOPY_ADDR_BASE_NAME_TABLE_ID_OFFSET) |
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
		this.nameTableId =
			(number >> constants.LOOPY_ADDR_BASE_NAME_TABLE_ID_OFFSET) &
			constants.LOOPY_ADDR_BASE_NAME_TABLE_ID_MASK;
		this.fineY =
			(number >> constants.LOOPY_ADDR_FINE_Y_OFFSET) &
			constants.LOOPY_ADDR_FINE_Y_MASK;
	}

	_switchHorizontalNameTable() {
		this.nameTableId = this.nameTableId ^ 0b1;
	}

	_switchVerticalNameTable() {
		this.nameTableId = this.nameTableId ^ 0b10;
	}
}
