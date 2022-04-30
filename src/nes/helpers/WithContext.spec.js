import WithContext from "./WithContext";
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

		it("it works without an onLoad method", () => {
			target.onLoad = undefined;
			(() => target.loadContext({})).should.not.throw(Error);
		});

		it("it works without an onUnload method", () => {
			target.onUnload = undefined;
			target.loadContext({});
			(() => target.unloadContext({})).should.not.throw(Error);
		});
	});
});
