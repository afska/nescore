import data from "./data";
import _ from "lodash";

export default _.keyBy([...data], "id");
