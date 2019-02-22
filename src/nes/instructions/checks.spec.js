import instructions from ".";
import createTestContext from "../helpers/createTestContext";
const should = require("chai").Should();

describe("instructions", () => {
	describe("checks", () => {
		let cpu, memory, context;

		beforeEach(() => {
			({ cpu, memory, context } = createTestContext());
		});

		describe("BIT", () => {
			[
				{ mask: 0b01100101, value: 0b10011010, z: true, n: true, v: false },
				{ mask: 0b11100101, value: 0b01011010, z: false, n: false, v: true }
			].forEach(({ mask, value, z, n, v }) => {
				it(`sets the Z, N, and V flags with mask=0b${mask.toString(
					2
				)} and value=0b${value.toString(2)}`, () => {
					cpu.registers.a.value = mask;
					memory.writeAt(0x02e0, value);

					instructions.BIT.execute(context, 0x02e0);
					cpu.flags.z.should.equal(z);
					cpu.flags.n.should.equal(n);
					cpu.flags.v.should.equal(v);
				});
			});
		});

		[
			{
				instruction: "CMP",
				register: "a",
				source: 10,
				value: 120,
				z: false,
				n: false,
				c: false
			},
			{
				instruction: "CMP",
				register: "a",
				source: 112,
				value: 2,
				z: false,
				n: false,
				c: true
			},
			{
				instruction: "CPX",
				register: "x",
				source: 100,
				value: 100,
				z: true,
				n: false,
				c: true
			},
			{
				instruction: "CPY",
				register: "y",
				source: 240,
				value: 30,
				z: false,
				n: true,
				c: true
			}
		].forEach(({ instruction, register, source, value, z, n, c }) => {
			describe(instruction, () => {
				it(`compares and sets the proper flags with ${register}=${source} and value=${value}`, () => {
					cpu.registers[register].value = source;
					instructions[instruction].execute(context, value);
					cpu.flags.z.should.equal(z);
					cpu.flags.n.should.equal(n);
					cpu.flags.c.should.equal(c);
				});
			});
		});
	});
});
