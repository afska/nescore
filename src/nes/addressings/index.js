import none from "./none";
import immediate from "./immediate";
import absolute from "./absolute";
import relative from "./relative";
import _ from "lodash";

export default _.keyBy([none, immediate, absolute, relative], "id");
