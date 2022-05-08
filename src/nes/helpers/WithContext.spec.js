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
				}
			};
			WithContext.apply(target);
		});

		it("should set the context property on loadContext", () => {
			target.loadContext({ some: "thing" });
			target.context.should.eql({ some: "thing" });
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

		it("it works without an onLoad method", () => {
			target.onLoad = undefined;
			(() => target.loadContext({})).should.not.throw(Error);
		});
	});
});
