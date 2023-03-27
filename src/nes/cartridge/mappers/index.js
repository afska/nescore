import _0_NROM from "./_0_NROM";
import _1_MMC1 from "./_1_MMC1";
import _2_UxROM from "./_2_UxROM";
import _3_CNROM from "./_3_CNROM";
import _4_MMC3 from "./_4_MMC3";
import _30_UNROM512 from "./_30_UNROM512";
import _ from "lodash";

export default _.keyBy(
	[_0_NROM, _1_MMC1, _2_UxROM, _3_CNROM, _4_MMC3, _30_UNROM512],
	"id"
);
