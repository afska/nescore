import instructions from ".";
import createTestContext from "../../helpers/createTestContext";
import _ from "lodash";
const should = require("chai").Should();

describe("instructions", () => {
	describe("branching", () => {
		let cpu, context;

		beforeEach(() => {
			({ cpu, context } = createTestContext());
			cpu.pc.value = 0x1000;
		});

		[
			{ instruction: "BCC", flag: "c" },
			{ instruction: "BNE", flag: "z" },
			{ instruction: "BPL", flag: "n" },
			{ instruction: "BVC", flag: "v" }
		].forEach(({ instruction, flag }) => {
			describe(instruction, () => {
				it("jumps if the flag is clear", () => {
					cpu.flags[flag] = false;
					instructions[instruction].execute(context, 0x2000);
					cpu.pc.value.should.equal(0x2000);
					cpu.extraCycles.should.equal(1);
				});

				it("doesnt jump if the flag is set", () => {
					cpu.extraCycles = 3;
					cpu.flags[flag] = true;
					instructions[instruction].execute(context, 0x2000);
					cpu.pc.value.should.equal(0x1000);
					cpu.extraCycles.should.equal(0);
				});
			});
		});

		[
			{ instruction: "BCS", flag: "c" },
			{ instruction: "BEQ", flag: "z" },
			{ instruction: "BMI", flag: "n" },
			{ instruction: "BVS", flag: "v" }
		].forEach(({ instruction, flag }) => {
			describe(instruction, () => {
				it("jumps if the flag is set", () => {
					cpu.flags[flag] = true;
					instructions[instruction].execute(context, 0x2000);
					cpu.pc.value.should.equal(0x2000);
					cpu.extraCycles.should.equal(1);
				});

				it("doesnt jump if the flag is clear", () => {
					cpu.extraCycles = 3;
					cpu.flags[flag] = false;
					instructions[instruction].execute(context, 0x2000);
					cpu.pc.value.should.equal(0x1000);
					cpu.extraCycles.should.equal(0);
				});
			});
		});

		describe("JMP", () => {
			it("jumps to the address", () => {
				instructions.JMP.execute(context, 0x1234);
				cpu.pc.value.should.equal(0x1234);
			});
		});

		describe("JSR", () => {
			it("pushes the current program counter (minus one) to the stack and jumps to the address", () => {
				cpu.pc.value = 0xfe31;
				instructions.JSR.execute(context, 0x1234);
				cpu.stack.pop2Bytes().should.equal(0xfe30);
				cpu.pc.value.should.equal(0x1234);
			});
		});

		describe("RTI", () => {
			it("pulls the processor flags and the program counter from the stack", () => {
				cpu.stack.push2Bytes(0xfe35);
				cpu.stack.push(0b10101000);
				instructions.RTI.execute(context);
				cpu.flags.toByte().should.equal(0b10101000);
				cpu.pc.value.should.equal(0xfe35);
			});
		});

		describe("RTS", () => {
			it("pulls the program counter (plus one) from the stack", () => {
				cpu.stack.push2Bytes(0xfe35);
				instructions.RTS.execute(context);
				cpu.pc.value.should.equal(0xfe36);
			});
		});
	});
});
