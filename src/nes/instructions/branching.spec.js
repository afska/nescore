import instructions from ".";
import createTestContext from "../helpers/createTestContext";
import _ from "lodash";
const should = require("chai").Should();

describe("instructions", () => {
	describe("branching", () => {
		let cpu, context;

		beforeEach(() => {
			({ cpu, context } = createTestContext());
			cpu.pc.value = 100;
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
					instructions[instruction].execute(context, 200);
					cpu.pc.value.should.equal(200);
				});

				it("doesnt jump if the flag is set", () => {
					cpu.flags[flag] = true;
					instructions[instruction].execute(context, 200);
					cpu.pc.value.should.equal(100);
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
					instructions[instruction].execute(context, 200);
					cpu.pc.value.should.equal(200);
				});

				it("doesnt jump if the flag is clear", () => {
					cpu.flags[flag] = false;
					instructions[instruction].execute(context, 200);
					cpu.pc.value.should.equal(100);
				});
			});
		});
	});
});
