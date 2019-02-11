import { createCollection } from ".";
const should = require("chai").Should();

describe("helpers", () => {
  describe("createCollection", () => {
    it("can create a collection", () => {
      createCollection([
        { name: "one", size: 2 },
        { name: "two", size: 4 }
      ]).should.eql({
        one: { id: 0, name: "one", size: 2 },
        two: { id: 1, name: "two", size: 4 }
      });
    });
  });
});
