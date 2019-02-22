import logical from "./logical";
import checks from "./checks";
import data from "./data";
import misc from "./misc";
import _ from "lodash";

export default _.keyBy([...logical, ...checks, ...data, ...misc], "id");
