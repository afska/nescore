import { Byte } from ".";
const should = require("chai").Should();

describe("helpers", () => {
	describe("byte", () => {
		it("can create a number from a signed byte", () => {
			Byte.toNumber(0b11111011).should.equal(-5);
			Byte.toNumber(0b00000101).should.equal(5);
		});

		it("can create a signed byte from a number", () => {
			Byte.toSignedByte(-5).should.equal(0b11111011);
			Byte.toSignedByte(5).should.equal(0b00000101);
		});

		it("can create 16-bit numbers from two bytes", () => {
			Byte.to16BitNumber(0xfe, 0x12).should.equal(0xfe12);
		});
	});
});
