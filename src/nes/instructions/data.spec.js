import instructions from ".";
import CPU from "../CPU";
import { signedByte } from "../helpers";
const should = require("chai").Should();

describe("instructions", () => {
	describe("data", () => {
		let cpu = null;

		beforeEach(() => {
			cpu = new CPU();
		});

		[
			{ instruction: "CLC", flag: "c" },
			{ instruction: "CLD", flag: "d" },
			{ instruction: "CLI", flag: "i" },
			{ instruction: "CLV", flag: "v" }
		].forEach(({ instruction, flag }) => {
			describe(instruction, () => {
				it("clears the flag", () => {
					cpu.flags[flag] = true;
					instructions[instruction].execute(cpu);
					cpu.flags[flag].should.equal(false);
				});
			});
		});

		[
			{ instruction: "LDA", register: "a" },
			{ instruction: "LDX", register: "x" },
			{ instruction: "LDY", register: "y" }
		].forEach(({ instruction, register }) => {
			describe(instruction, () => {
				it("works with positive value", () => {
					instructions[instruction].execute(cpu, 5);
					cpu.registers[register].value.should.equal(5);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(false);
				});

				it("works with negative value", () => {
					const value = signedByte.toByte(-5);
					instructions[instruction].execute(cpu, value);
					cpu.registers[register].value.should.equal(value);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(true);
				});

				it("works with zero value", () => {
					instructions[instruction].execute(cpu, 0);
					cpu.registers[register].value.should.equal(0);
					cpu.flags.z.should.equal(true);
					cpu.flags.n.should.equal(false);
				});
			});
		});

		[{ instruction: "SEI", flag: "i" }].forEach(({ instruction, flag }) => {
			describe(instruction, () => {
				it("sets the flag", () => {
					cpu.flags[flag] = false;
					instructions[instruction].execute(cpu);
					cpu.flags[flag].should.equal(true);
				});
			});
		});
	});
});
