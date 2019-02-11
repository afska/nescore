import { signedByte } from ".";
const should = require("chai").Should();

describe("helpers", () => {
  describe("signedByte", () => {
    it("can create a number from a byte", () => {
      signedByte.toNumber(0b11111011).should.equal(-5);
      signedByte.toNumber(0b00000101).should.equal(5);
    });

    it("can create a byte from a number", () => {
      signedByte.toByte(-5).should.equal(0b11111011);
      signedByte.toByte(5).should.equal(0b00000101);
    });
  });
});
