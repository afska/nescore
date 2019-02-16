import instructions from ".";
import CPU from "../CPU";
import { MemoryChunk } from "../memory";
import { ExecutionContext } from "../context";
import { signedByte } from "../helpers";
const should = require("chai").Should();

const KB = 1024;

describe("instructions", () => {
	describe("data", () => {
		let cpu, memory, context;

		beforeEach(() => {
			cpu = new CPU();
			memory = new MemoryChunk(64 * KB);
			context = { cpu, memory };
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
					instructions[instruction].execute(context);
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
					instructions[instruction].execute(context, 5);
					cpu.registers[register].value.should.equal(5);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(false);
				});

				it("works with negative value", () => {
					const value = signedByte.toByte(-5);
					instructions[instruction].execute(context, value);
					cpu.registers[register].value.should.equal(value);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(true);
				});

				it("works with zero value", () => {
					instructions[instruction].execute(context, 0);
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
					instructions[instruction].execute(context);
					cpu.flags[flag].should.equal(true);
				});
			});
		});
	});
});
