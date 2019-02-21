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
	});
});
