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

		it("can determine if a value has overflow", () => {
			Byte.hasOverflow(258).should.equal(true);
			Byte.hasOverflow(255).should.equal(false);
			Byte.hasOverflow(25).should.equal(false);
			Byte.hasOverflow(300).should.equal(true);
		});

		it("can determine if a value is positive or negative", () => {
			Byte.isPositive(0xfe).should.equal(false);
			Byte.isNegative(0xfe).should.equal(true);

			Byte.isPositive(0x10).should.equal(true);
			Byte.isNegative(0x10).should.equal(false);
		});

		it("can negate numbers using two's complement", () => {
			const negative112 = Byte.toSignedByte(-112);
			Byte.negate(112).should.equal(negative112);
			Byte.negate(negative112).should.equal(112);
		});

		it("can force numbers to 8-bit", () => {
			Byte.force8Bit(0b110000000).should.equal(0b10000000);
			Byte.force8Bit(-2).should.equal(254);
		});

		it("can force numbers to 16-bit", () => {
			Byte.force16Bit(65537).should.equal(1);
			Byte.force16Bit(-2).should.equal(65534);
		});

		it("can return a bit from a number", () => {
			Byte.getBit(2, 1).should.equal(1);
			Byte.getBit(2, 0).should.equal(0);

			Byte.getBit(0b100101, 0).should.equal(1);
			Byte.getBit(0b100101, 1).should.equal(0);
			Byte.getBit(0b100101, 2).should.equal(1);
			Byte.getBit(0b100101, 3).should.equal(0);
			Byte.getBit(0b100101, 4).should.equal(0);
			Byte.getBit(0b100101, 5).should.equal(1);
			Byte.getBit(0b100101, 6).should.equal(0);
		});

		it("can return a sub-number from a number", () => {
			Byte.getSubNumber(0b00001110, 1, 3).should.equal(0b111);
			Byte.getSubNumber(0b00001110, 0, 3).should.equal(0b110);
			Byte.getSubNumber(0b00001110, 0, 2).should.equal(0b10);
			Byte.getSubNumber(0b00001110, 2, 2).should.equal(0b011);
			Byte.getSubNumber(0b00001110, 3, 2).should.equal(0b01);
		});

		it("can insert a sub-number inside a byte", () => {
			Byte.setSubNumber(0b00001110, 2, 2, 0b10).should.equal(0b00001010);
			Byte.setSubNumber(0b00001110, 2, 2, 0b01).should.equal(0b00000110);
			Byte.setSubNumber(0b00001110, 2, 5, 0b10101).should.equal(0b01010110);
		});

		it("can split 16-bit numbers", () => {
			Byte.highPartOf(0xfe20).should.equal(0xfe);
			Byte.lowPartOf(0xfe20).should.equal(0x20);
		});

		it("can create 16-bit numbers from two bytes", () => {
			Byte.to16Bit(0xfe, 0x12).should.equal(0xfe12);
		});
	});
});
