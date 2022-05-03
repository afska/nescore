import constants from "../../constants";

/**
 * // TODO: Talk about loopy
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

	toNumber() {
		return (
			(this.coarseX << constants.LOOPY_ADDR_COARSE_X_OFFSET) |
			(this.coarseY << constants.LOOPY_ADDR_COARSE_Y_OFFSET) |
			(this.baseNameTableId << constants.LOOPY_ADDR_BASE_NAME_TABLE_ID_OFFSET) |
			(this.fineY << constants.LOOPY_ADDR_FINE_Y_OFFSET)
		);
	}

	fromNumber(number) {
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
