import logical from "./logical";
import data from "./data";
import misc from "./misc";
import _ from "lodash";

export default _.keyBy([...logical, ...data, ...misc], "id");
