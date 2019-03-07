import arithmetic from "./arithmetic";
import branching from "./branching";
import checks from "./checks";
import data from "./data";
import logical from "./logical";
import misc from "./misc";
import _ from "lodash";

export default _.keyBy(
	[...arithmetic, ...branching, ...checks, ...data, ...logical, ...misc],
	"id"
);
