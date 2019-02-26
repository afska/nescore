import { Byte } from ".";
const should = require("chai").Should();

describe("helpers", () => {
	describe("byte", () => {
		it("can create a number from a signed byte", () => {
			Byte.toNumber(0b11111011).should.equal(-5);
			Byte.toNumber(0b00000101).should.equal(5);

			Byte.toNumber(127).should.equal(127);
			Byte.toNumber(128).should.equal(-128);
		});

		it("can create a signed byte from a number", () => {
			Byte.toSignedByte(-5).should.equal(0b11111011);
			Byte.toSignedByte(5).should.equal(0b00000101);

			Byte.toSignedByte(127).should.equal(127);
			Byte.toSignedByte(-128).should.equal(128);
		});

		it("can create 16-bit numbers from two bytes", () => {
			Byte.to16BitNumber(0xfe, 0x12).should.equal(0xfe12);
		});

		it("can determine if a value is positive or negative", () => {
			Byte.isPositive(0xfe).should.equal(false);
			Byte.isNegative(0xfe).should.equal(true);

			Byte.isPositive(0x10).should.equal(true);
			Byte.isNegative(0x10).should.equal(false);
		});

		it("can determine if a value has overflow", () => {
			Byte.hasOverflow(258).should.equal(true);
			Byte.hasOverflow(255).should.equal(false);
			Byte.hasOverflow(25).should.equal(false);
			Byte.hasOverflow(300).should.equal(true);
		});
	});
});
