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

			it("adds the carry bit", () => {
				cpu.registers.a.value = 20;
				cpu.flags.c = true;
				instructions.ADC.execute(context, 5);
				cpu.registers.a.value.should.equal(26);
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

				// positive (60) + positive (75) = negative (-121) => overflow
				cpu.flags.c = false;
				instructions.ADC.execute(context, 75);
				cpu.flags.c.should.equal(false);
				cpu.flags.v.should.equal(true);

				// result is over 255 => carry
				cpu.flags.c = false;
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

		describe("ROL", () => {
			it("multiplies the value by 2", () => {
				memory.writeAt(0x1234, 12);
				instructions.ROL.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(24);
			});

			it("sets the C flag with the bit 7", () => {
				memory.writeAt(0x1234, 0b10100000);
				instructions.ROL.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0b01000000);
				cpu.flags.c.should.equal(true);
			});

			it("sets the bit 0 with the C flag", () => {
				cpu.flags.c = true;
				memory.writeAt(0x1234, 0b10100000);
				instructions.ROL.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0b01000001);
			});

			it("updates the Z and N flags", () => {
				memory.writeAt(0x1234, 0b11000000);
				instructions.ROL.execute(context, 0x1234);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(true);

				cpu.flags.c = false;

				memory.writeAt(0x1234, 0);
				instructions.ROL.execute(context, 0x1234);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});
		});

		describe("ROR", () => {
			it("divides the value by 2", () => {
				memory.writeAt(0x1234, 24);
				instructions.ROR.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(12);
			});

			it("sets the C flag with the bit 0", () => {
				memory.writeAt(0x1234, 0b00000101);
				instructions.ROR.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0b00000010);
				cpu.flags.c.should.equal(true);
			});

			it("sets the bit 7 with the C flag", () => {
				cpu.flags.c = true;
				memory.writeAt(0x1234, 0b00000101);
				instructions.ROR.execute(context, 0x1234);
				memory.readAt(0x1234).should.equal(0b10000010);
			});

			it("updates the Z and N flags", () => {
				cpu.flags.c = true;
				memory.writeAt(0x1234, 0b11000000);
				instructions.ROR.execute(context, 0x1234);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(true);

				cpu.flags.c = false;

				memory.writeAt(0x1234, 0);
				instructions.ROR.execute(context, 0x1234);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});
		});

		describe("SBC", () => {
			it("substracts the value from the accumulator - 1 when C is clear", () => {
				cpu.registers.a.value = 20;
				instructions.SBC.execute(context, 5);
				cpu.registers.a.value.should.equal(14);
			});

			it("substracts the value from the accumulator - 0 when C is set", () => {
				cpu.registers.a.value = 20;
				cpu.flags.c = true;
				instructions.SBC.execute(context, 5);
				cpu.registers.a.value.should.equal(15);
			});

			it("updates the Z and N flags", () => {
				cpu.registers.a.value = 20;
				instructions.SBC.execute(context, 30);
				cpu.flags.z.should.equal(false);
				cpu.flags.n.should.equal(true);

				cpu.registers.a.value = 0;
				cpu.flags.c = true;
				instructions.SBC.execute(context, 0);
				cpu.flags.z.should.equal(true);
				cpu.flags.n.should.equal(false);
			});

			it("updates the C and V flags", () => {
				cpu.registers.a.value = 50;
				instructions.SBC.execute(context, 10);
				cpu.flags.c.should.equal(true);
				cpu.flags.v.should.equal(false);

				// positive (40) - negative (-100) = negative (-116) => overflow
				cpu.registers.a.value = 40;
				cpu.flags.c = true;
				instructions.SBC.execute(context, Byte.toSignedByte(-100));
				cpu.flags.c.should.equal(false); // there was borrow
				cpu.flags.v.should.equal(true); //  |
				//                                  v
				//                                  00101000 (40)
				//                                - 10011100 (-100)
				//                                  ^

				// negative (-40) - positive (100) = positive (116) => overflow
				cpu.registers.a.value = Byte.toSignedByte(-40);
				cpu.flags.c = true;
				instructions.SBC.execute(context, 100);
				cpu.flags.c.should.equal(true);
				cpu.flags.v.should.equal(true);
			});
		});
	});
});
