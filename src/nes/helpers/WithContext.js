import _ from "lodash";

/** A mixin for anything that has a context. */
export default {
	/** Applies the mixin. */
	apply(obj) {
		_.defaults(obj, _.omit(this, "apply"));

		obj.context = null;
		obj._dependencies = [];
	},

	/** Adds a `dependency` that needs to receive the context. */
	addDependency(dependency) {
		this._dependencies.push(dependency);

		return this;
	},

	/** Loads an execution context. */
	loadContext(context) {
		this.context = context;
		if (this.onLoad) this.onLoad(context);
		for (let dependency of this._dependencies) dependency.loadContext(context);

		return this;
	},

	/** Unloads the current execution context. */
	unloadContext() {
		this.requireContext();

		this.context = null;
		if (this.onUnload) this.onUnload();
		for (let dependency of this._dependencies.reverse())
			dependency.unloadContext();

		return this;
	},

	/** Asserts that a current context exists.. */
	requireContext() {
		if (!this.context) throw new Error("Execution context not found.");
	}
};
