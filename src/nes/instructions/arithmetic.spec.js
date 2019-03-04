import instructions from ".";
import { Byte } from "../helpers";
import createTestContext from "../helpers/createTestContext";
const should = require("chai").Should();

describe("instructions", () => {
	describe("arithmetic", () => {
		let cpu, memory, context;

		beforeEach(() => {
			({ cpu, memory, context } = createTestContext());
		});

		describe("ADC", () => {
			it("adds the value to the accumulator", () => {
				cpu.registers.a.value = 20;
				instructions.ADC.execute(context, 5);
				cpu.registers.a.value.should.equal(25);
			});

			it("updates the Z and N flags", () => {
				cpu.registers.a.value = 50;
				instructions.ADC.execute(context, 120);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(true);

				instructions.ADC.execute(context, 86);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});

			it("updates the C and V flags", () => {
				cpu.registers.a.value = 50;
				instructions.ADC.execute(context, 10);
				cpu.flags.c.should.equal(false);
				cpu.flags.v.should.equal(false);

				instructions.ADC.execute(context, 75);
				cpu.flags.c.should.equal(false);
				cpu.flags.v.should.equal(true);

				instructions.ADC.execute(context, 122);
				cpu.flags.c.should.equal(true);
				cpu.flags.v.should.equal(false);
			});
		});

		describe("ASL", () => {
			it("multiplies the value by 2", () => {
				memory.writeAt(0x1234, 12);
				instructions.ASL.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(24);
				cpu.flags.c.should.equal(false);
			});

			it("sets the C flag when the result doesn't fit in 8 bit", () => {
				memory.writeAt(0x1234, 0b11000000);
				instructions.ASL.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0b10000000);
				cpu.flags.c.should.equal(true);
			});

			it("updates the Z and N flags", () => {
				memory.writeAt(0x1234, 0b11000000);
				instructions.ASL.execute(context, 0x1234);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(true);

				memory.writeAt(0x1234, 0);
				instructions.ASL.execute(context, 0x1234);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});
		});

		describe("DEC", () => {
			it("decrements the value", () => {
				memory.writeAt(0x1234, 9);
				instructions.DEC.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(8);
			});

			it("sets the Z flag", () => {
				memory.writeAt(0x1234, 1);
				instructions.DEC.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});

			it("sets the N flag", () => {
				memory.writeAt(0x1234, 0);
				instructions.DEC.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(255);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(true);
			});
		});

		[
			{ instruction: "DEX", register: "x" },
			{ instruction: "DEY", register: "y" }
		].forEach(({ instruction, register }) => {
			describe(instruction, () => {
				it("decrements the value and updates the flags", () => {
					cpu.registers[register].value = 1;
					instructions[instruction].execute(context);

					cpu.registers[register].value.should.equal(0);
					cpu.flags.z.should.equal(true);
					cpu.flags.n.should.equal(false);

					cpu.registers[register].value = 0;
					instructions[instruction].execute(context);

					cpu.registers[register].value.should.equal(255);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(true);
				});
			});
		});

		describe("INC", () => {
			it("increments the value", () => {
				memory.writeAt(0x1234, 8);
				instructions.INC.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(9);
			});

			it("sets the Z flag", () => {
				memory.writeAt(0x1234, 255);
				instructions.INC.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});

			it("sets the N flag", () => {
				memory.writeAt(0x1234, 244);
				instructions.INC.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(245);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(true);
			});
		});

		[
			{ instruction: "INX", register: "x" },
			{ instruction: "INY", register: "y" }
		].forEach(({ instruction, register }) => {
			describe(instruction, () => {
				it("increments the value and updates the flags", () => {
					cpu.registers[register].value = 255;
					instructions[instruction].execute(context);

					cpu.registers[register].value.should.equal(0);
					cpu.flags.z.should.equal(true);
					cpu.flags.n.should.equal(false);

					cpu.registers[register].value = 244;
					instructions[instruction].execute(context);

					cpu.registers[register].value.should.equal(245);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(true);
				});
			});
		});

		describe("LSR", () => {
			it("divides the value by 2", () => {
				memory.writeAt(0x1234, 128);
				instructions.LSR.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(64);
				cpu.flags.c.should.equal(false);
			});

			it("sets the C flag when the last bit is 1", () => {
				memory.writeAt(0x1234, 0b11000001);
				instructions.LSR.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0b01100000);
				cpu.flags.c.should.equal(true);
			});

			it("updates the Z and N flags", () => {
				memory.writeAt(0x1234, 0b11000000);
				instructions.LSR.execute(context, 0x1234);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(false);

				memory.writeAt(0x1234, 0);
				instructions.LSR.execute(context, 0x1234);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});
		});
	});
});
