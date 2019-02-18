import addressings from "..";
import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

describe("addressings", () => {
	let context;

	beforeEach(() => {
		context = createTestContext();
	});

	describe("indexedAbsoluteX", () => {
		it("returns the address + X", () => {
			context.cpu.registers.x.value = 180;
			addressings.INDEXED_ABSOLUTE_X.getParameter(context, 1000).should.equal(
				1180
			);
		});
	});

	describe("indexedAbsoluteY", () => {
		it("returns the address + Y", () => {
			context.cpu.registers.y.value = 180;
			addressings.INDEXED_ABSOLUTE_Y.getParameter(context, 1000).should.equal(
				1180
			);
		});
	});

	describe("indexedZeroPageX", () => {
		it("returns the address + X", () => {
			context.cpu.registers.x.value = 180;
			addressings.INDEXED_ZERO_PAGE_X.getParameter(context, 130).should.equal(
				310
			);
		});
	});

	describe("indexedZeroPageY", () => {
		it("returns the address + Y", () => {
			context.cpu.registers.y.value = 180;
			addressings.INDEXED_ZERO_PAGE_Y.getParameter(context, 130).should.equal(
				310
			);
		});
	});

	describe("indexedIndirectX", () => {
		it("dereferences the address + X", () => {
			context.cpu.registers.x.value = 180;
			context.memory.writeAt(310, 0x12);
			context.memory.writeAt(311, 0xfe);
			addressings.INDEXED_INDIRECT_X.getParameter(context, 130).should.equal(
				0xfe12
			);
		});
	});

	describe("indexedIndirectY", () => {
		it("dereferences the address and then adds Y", () => {
			context.cpu.registers.y.value = 0xb4;
			context.memory.writeAt(130, 0x12);
			context.memory.writeAt(131, 0xfe);
			addressings.INDEXED_INDIRECT_Y.getParameter(context, 130).should.equal(
				0xfec6
			);
		});
	});
});
