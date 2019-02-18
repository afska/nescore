import addressings from "..";
import createTestContext from "../../helpers/createTestContext";
import { Byte } from "../../helpers";
const should = require("chai").Should();

describe("addressings", () => {
	let context;

	beforeEach(() => {
		context = createTestContext();
	});

	describe("immediate", () => {
		it("returns the same value", () => {
			addressings.IMMEDIATE.getParameter(context, 120).should.equal(120);
		});
	});

	describe("absolute", () => {
		it("returns the same address", () => {
			addressings.ABSOLUTE.getParameter(context, 0xfe8d).should.equal(0xfe8d);
		});
	});

	describe("zeroPage", () => {
		it("returns the same address", () => {
			addressings.ZERO_PAGE.getParameter(context, 120).should.equal(120);
		});
	});

	describe("indirect", () => {
		it("dereferences the address", () => {
			context.memory.writeAt(130, 0x12);
			context.memory.writeAt(131, 0xfe);
			addressings.INDIRECT.getParameter(context, 130).should.equal(0xfe12);
		});
	});

	describe("relative", () => {
		it("returns an address based on the current pc + offset", () => {
			context.cpu.pc.value = 0xfe10;
			addressings.RELATIVE.getParameter(context, 4).should.equal(0xfe14);
			addressings.RELATIVE.getParameter(
				context,
				Byte.toSignedByte(-10)
			).should.equal(0xfe06);
		});
	});
});
