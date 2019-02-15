import _ from "lodash";

/** The current program execution context. It's like a BUS. */
export default class ExecutionContext {
	constructor(data) {
		_.assign(this, data);
	}
}
