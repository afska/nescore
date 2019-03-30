import { WithContext } from ".";
const should = require("chai").Should();

describe("helpers", () => {
	describe("WithContext", () => {
		let state, target;

		beforeEach(() => {
			state = null;
			target = {
				onLoad() {
					state = 100;
				},
				onUnload() {
					state = 99;
				}
			};
			WithContext.apply(target);
		});

		it("should set the context property on loadContext", () => {
			target.loadContext({ some: "thing" });
			target.context.should.eql({ some: "thing" });
		});

		it("should clear the context property on unloadContext", () => {
			target.loadContext({ some: "thing" });
			target.unloadContext();
			should.not.exist(target.context);
		});

		it("has a requireContext that checks if it's loaded", () => {
			(() => target.requireContext()).should.throw(
				"Execution context not found."
			);
		});

		it("calls the onLoad method", () => {
			target.loadContext({});
			state.should.equal(100);
		});

		it("calls the onUnload method", () => {
			target.loadContext({});
			target.unloadContext();
			state.should.equal(99);
		});

		it("works without an onLoad method", () => {
			target.onLoad = undefined;
			(() => target.loadContext({})).should.not.throw(Error);
		});

		it("works without an onUnload method", () => {
			target.onUnload = undefined;
			target.loadContext({});
			(() => target.unloadContext({})).should.not.throw(Error);
		});

		describe("dependencies", () => {
			let thing;

			beforeEach(() => {
				thing = 3;

				const dep1 = {
					onLoad() {
						thing /= 2;
					},
					onUnload() {
						thing /= 3;
					}
				};

				const dep2 = {
					onLoad() {
						thing += 1;
					},
					onUnload() {
						thing += 2;
					}
				};

				WithContext.apply(dep1);
				WithContext.apply(dep2);
				target.addDependency(dep1).addDependency(dep2);
			});

			it("loads dependencies in the right order", () => {
				target.loadContext({});
				thing.should.equal(2.5); // -> 3 / 2 + 1
			});

			it("unloads dependencies in reversed order", () => {
				target.loadContext({}).unloadContext();
				thing.should.equal(1.5); // -> (2.5 + 2) / 3
			});
		});
	});
});
