import data from "./data";
import misc from "./misc";
import _ from "lodash";

export default _.keyBy([...data, ...misc], "id");
