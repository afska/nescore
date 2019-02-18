import implicit from "./implicit";
import immediate from "./immediate";
import absolute from "./absolute";
import relative from "./relative";
import indirect from "./indirect";
import _ from "lodash";

export default _.keyBy(
	[implicit, immediate, absolute, relative, indirect],
	"id"
);
