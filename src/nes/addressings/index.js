import implicit from "./implicit";
import immediate from "./immediate";
import absolute from "./absolute";
import zeroPage from "./zeroPage";
import relative from "./relative";
import indirect from "./indirect";
import _ from "lodash";

export default _.keyBy(
	[implicit, immediate, absolute, zeroPage, relative, indirect],
	"id"
);
