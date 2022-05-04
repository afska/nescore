import NROM from "./_0_NROM";
import UxROM from "./_2_UxROM";
import _ from "lodash";

export default _.keyBy([NROM, UxROM], "id");
