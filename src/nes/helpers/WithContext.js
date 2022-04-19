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
		return this;
	},

	/** Unloads the current execution context. */
	unloadContext() {
		this.requireContext();

		if (this.onUnload) this.onUnload();
		this.context = null;
		return this;
	},

	/** Asserts that a current context exists. */
	requireContext() {
		if (!this.context) throw new Error("Execution context not found.");
	}
};
