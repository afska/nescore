import addressings from "..";
import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

describe("addressings", () => {
	let cpu, memory, context;

	beforeEach(() => {
		({ cpu, memory, context } = createTestContext());
	});

	const testExtraCycle = (
		register,
		addressing,
		base1,
		offset1,
		base2,
		offset2
	) => {
		describe("when the operation can take extra cycles", () => {
			it("adds a cycle if a page-crossed event occurs", () => {
				cpu.registers[register].value = offset1;
				addressings[addressing].getAddress(context, base1, true);
				cpu.extraCycles.should.equal(1);
			});

			it("doesnt add a cycle if no page-crossed event occurs", () => {
				cpu.registers[register].value = offset2;
				addressings[addressing].getAddress(context, base2, true);
				cpu.extraCycles.should.equal(0);
			});
		});
	};

	["x", "y"].forEach((register) => {
		const name = register.toUpperCase();

		describe(`indexedAbsolute${name}`, () => {
			it(`returns the address + ${name}`, () => {
				cpu.registers[register].value = 180;
				addressings[`INDEXED_ABSOLUTE_${name}`]
					.getAddress(context, 1000)
					.should.equal(1180);
			});

			it("cannot cross the limit of memory", () => {
				cpu.registers[register].value = 2;
				addressings[`INDEXED_ABSOLUTE_${name}`]
					.getAddress(context, 0xffff)
					.should.equal(0x0001);
			});

			testExtraCycle(register, `INDEXED_ABSOLUTE_${name}`, 1000, 180, 900, 20);
		});
	});

	["x", "y"].forEach((register) => {
		const name = register.toUpperCase();

		describe(`indexedZeroPage${name}`, () => {
			it(`returns the address + ${name}`, () => {
				cpu.registers[register].value = 20;
				addressings[`INDEXED_ZERO_PAGE_${name}`]
					.getAddress(context, 130)
					.should.equal(150);
			});

			it("cannot cross the first page", () => {
				cpu.registers[register].value = 200;
				addressings[`INDEXED_ZERO_PAGE_${name}`]
					.getAddress(context, 130)
					.should.equal(74);
			});
		});
	});

	describe("indexedIndirectX", () => {
		it("dereferences the address + X", () => {
			cpu.registers.x.value = 180;
			memory.writeAt(195, 0x12);
			memory.writeAt(196, 0xfe);
			addressings.INDEXED_INDIRECT_X.getAddress(context, 15).should.equal(
				0xfe12
			);
		});

		it("cannot cross the first page", () => {
			cpu.registers.x.value = 255;
			memory.writeAt(0, 0x12);
			memory.writeAt(1, 0xfe);
			addressings.INDEXED_INDIRECT_X.getAddress(context, 1).should.equal(
				0xfe12
			);
		});

		it("cannot dereference the address outside the first page", () => {
			cpu.registers.x.value = 254;
			memory.writeAt(255, 0x12);
			memory.writeAt(0, 0xfe);
			addressings.INDEXED_INDIRECT_X.getAddress(context, 1).should.equal(
				0xfe12
			);
		});
	});

	describe("indexedIndirectY", () => {
		it("dereferences the address and then adds Y", () => {
			cpu.registers.y.value = 0xb4;
			memory.writeAt(130, 0x12);
			memory.writeAt(131, 0xfe);
			addressings.INDEXED_INDIRECT_Y.getAddress(context, 130).should.equal(
				0xfec6
			);
		});

		it("cannot cross the limit of memory", () => {
			cpu.registers.y.value = 3;
			memory.writeAt(130, 0xff);
			memory.writeAt(131, 0xff);
			addressings.INDEXED_INDIRECT_Y.getAddress(context, 130).should.equal(2);
		});

		it("cannot dereference the address outside the first page", () => {
			cpu.registers.y.value = 3;
			memory.writeAt(0xff, 0x12);
			memory.writeAt(0x00, 0xfe);
			addressings.INDEXED_INDIRECT_Y.getAddress(context, 0xff).should.equal(
				0xfe15
			);
		});

		describe("when the operation can take extra cycles", () => {
			it("adds a cycle if a page-crossed event occurs", () => {
				cpu.registers.y.value = 0xfc;
				memory.writeAt(130, 0x12);
				memory.writeAt(131, 0xfa);
				addressings.INDEXED_INDIRECT_Y.getAddress(context, 130, true);
				cpu.extraCycles.should.equal(1);
			});

			it("doesnt add a cycle if no page-crossed event occurs", () => {
				cpu.registers.y.value = 0xb4;
				memory.writeAt(130, 0x12);
				memory.writeAt(131, 0xfe);
				addressings.INDEXED_INDIRECT_Y.getAddress(context, 130, true);
				cpu.extraCycles.should.equal(0);
			});
		});
	});
});
