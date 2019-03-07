import instructions from ".";
import createTestContext from "../helpers/createTestContext";
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
				});

				it("doesnt jump if the flag is set", () => {
					cpu.flags[flag] = true;
					instructions[instruction].execute(context, 0x2000);
					cpu.pc.value.should.equal(0x1000);
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
				});

				it("doesnt jump if the flag is clear", () => {
					cpu.flags[flag] = false;
					instructions[instruction].execute(context, 0x2000);
					cpu.pc.value.should.equal(0x1000);
				});
			});
		});

		describe("JMP", () => {
			it("jumps to the address", () => {
				instructions.JMP.execute(context, 0x1234);
				cpu.pc.value.should.equal(0x1234);
			});
		});
	});
});
