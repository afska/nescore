import _ from "lodash";

/** A mixin for anything that has a context. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.defaults(obj, _.omit(this, "apply"));
	},

	/** The current execution context. */
	context: null,

	/** Loads an execution context. */
	loadContext(context) {
		this.context = context;
		if (this.onLoad) this.onLoad(context);
	},

	/** Unloads the current execution context. */
	unloadContext() {
		this.context = null;
		if (this.onUnload) this.onUnload();
	},

	/** Asserts that a current context exists.. */
	requireContext() {
		if (!this.context)
			throw new Error(
				"Execution context not found. Use the `.load(...)` method first!"
			);
	}
};
