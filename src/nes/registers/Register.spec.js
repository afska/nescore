import { Register8Bit } from ".";
const should = require("chai").Should();

describe("registers", () => {
  describe("Register8Bit", () => {
    it("allows initial values", () => {
      new Register8Bit(5).value.should.eql(5);
    });

    it("handles overflow correctly", () => {
      const register = new Register8Bit(250);
      register.value += 7;
      register.value.should.eql(1);
    });
  });
});
