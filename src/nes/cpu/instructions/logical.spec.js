import instructions from ".";
import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

describe("instructions", () => {
	describe("logical", () => {
		let cpu, context;

		beforeEach(() => {
			({ cpu, context } = createTestContext());
		});

		[
			{
				instruction: "AND",
				value1: 0b10100100,
				value2: 0b10000100,
				result: 0b10000100,
				zero: false,
				negative: true
			},
			{
				instruction: "EOR",
				value1: 0b00100100,
				value2: 0b00010100,
				result: 0b00110000,
				zero: false,
				negative: false
			},
			{
				instruction: "EOR",
				value1: 0b11111111,
				value2: 0b11111111,
				result: 0b00000000,
				zero: true,
				negative: false
			},
			{
				instruction: "ORA",
				value1: 0b00100100,
				value2: 0b00010100,
				result: 0b00110100,
				zero: false,
				negative: false
			}
		].forEach(({ instruction, value1, value2, result, zero, negative }) => {
			describe(instruction, () => {
				it("stores the right result", () => {
					cpu.registers.a.value = value1;
					instructions[instruction].execute(context, value2);
					cpu.registers.a.value.should.equal(result);
					cpu.flags.z = zero;
					cpu.flags.n = negative;
				});
			});
		});
	});
});
