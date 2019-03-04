import arithmetic from "./arithmetic";
import logical from "./logical";
import checks from "./checks";
import data from "./data";
import misc from "./misc";
import _ from "lodash";

export default _.keyBy(
	[...arithmetic, ...logical, ...checks, ...data, ...misc],
	"id"
);
