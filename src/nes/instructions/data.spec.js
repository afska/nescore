import instructions from ".";
import { Byte } from "../helpers";
import createTestContext from "../helpers/createTestContext";
import _ from "lodash";
const should = require("chai").Should();

describe("instructions", () => {
	describe("data", () => {
		let cpu, memory, context;

		beforeEach(() => {
			({ cpu, memory, context } = createTestContext());
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
				it("works with a positive value", () => {
					instructions[instruction].execute(context, 5);
					cpu.registers[register].value.should.equal(5);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(false);
				});

				it("works with a negative value", () => {
					const value = Byte.toSignedByte(-5);
					instructions[instruction].execute(context, value);
					cpu.registers[register].value.should.equal(value);
					cpu.flags.z.should.equal(false);
					cpu.flags.n.should.equal(true);
				});

				it("works with a zero value", () => {
					instructions[instruction].execute(context, 0);
					cpu.registers[register].value.should.equal(0);
					cpu.flags.z.should.equal(true);
					cpu.flags.n.should.equal(false);
				});
			});
		});

		describe("PHA", () => {
			it("pushes the accumulator into the stack", () => {
				cpu.registers.a.value = 88;
				instructions.PHA.execute(context);
				cpu.stack.pop().should.equal(88);
			});
		});

		describe("PHP", () => {
			it("pushes the flags into the stack", () => {
				cpu.flags.c = true;
				cpu.flags.v = true;
				instructions.PHP.execute(context);
				cpu.stack.pop().should.equal(0b01110101);
			});
		});

		describe("PLA", () => {
			it("sets the A register with a value from the stack", () => {
				cpu.stack.push(76);
				instructions.PLA.execute(context);
				cpu.registers.a.value.should.equal(76);
			});
		});

		describe("PLP", () => {
			it("pushes the right value into the stack", () => {
				cpu.stack.push(0b01000101);
				instructions.PLP.execute(context);
				cpu.flags.should.include({
					n: false,
					v: true,
					d: false,
					i: true,
					z: false,
					c: true
				});
			});
		});

		[
			{ instruction: "SEC", flag: "c" },
			{ instruction: "SED", flag: "d" },
			{ instruction: "SEI", flag: "i" }
		].forEach(({ instruction, flag }) => {
			describe(instruction, () => {
				it("sets the flag", () => {
					cpu.flags[flag] = false;
					instructions[instruction].execute(context);
					cpu.flags[flag].should.equal(true);
				});
			});
		});

		[
			{ instruction: "STA", register: "a" },
			{ instruction: "STX", register: "x" },
			{ instruction: "STY", register: "y" }
		].forEach(({ instruction, register }) => {
			describe(instruction, () => {
				it("writes the byte into the memory address", () => {
					cpu.registers[register].value = 123;
					instructions[instruction].execute(context, 0x1349);
					memory.readAt(0x1349).should.equal(123);
				});
			});
		});

		[
			{
				instruction: "TAX",
				sourceRegister: "registers.a",
				targetRegister: "registers.x"
			},
			{
				instruction: "TAY",
				sourceRegister: "registers.a",
				targetRegister: "registers.y"
			},
			{
				instruction: "TSX",
				sourceRegister: "sp",
				targetRegister: "registers.x"
			},
			{
				instruction: "TXA",
				sourceRegister: "registers.x",
				targetRegister: "registers.a"
			},
			{
				instruction: "TXS",
				sourceRegister: "registers.x",
				targetRegister: "sp"
			},
			{
				instruction: "TYA",
				sourceRegister: "registers.y",
				targetRegister: "registers.a"
			}
		].forEach(({ instruction, sourceRegister, targetRegister }) => {
			describe(instruction, () => {
				it("transfers the content", () => {
					_.set(cpu, `${sourceRegister}.value`, 123);
					instructions[instruction].execute(context);
					_.get(cpu, `${targetRegister}.value`).should.equal(123);
				});
			});
		});
	});
});
