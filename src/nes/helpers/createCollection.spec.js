import { createCollection } from ".";
const should = require("chai").Should();

describe("helpers", () => {
	describe("createCollection", () => {
		it("can create a collection", () => {
			createCollection([
				{ id: "one", size: 2 },
				{ id: "two", size: 4 }
			]).should.eql({
				one: { id: "one", size: 2 },
				two: { id: "two", size: 4 }
			});
		});
	});
});
