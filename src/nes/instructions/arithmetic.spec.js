import instructions from ".";
import { Byte } from "../helpers";
import createTestContext from "../helpers/createTestContext";
const should = require("chai").Should();

describe("instructions", () => {
	describe("data", () => {
		let cpu, context;

		beforeEach(() => {
			({ cpu, context } = createTestContext());
		});

		describe("ADC", () => {
			it("adds the value to the accumulator", () => {
				cpu.registers.a.value = 20;
				instructions.ADC.execute(context, 5);
				cpu.registers.a.value.should.equal(25);
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

				instructions.ADC.execute(context, 75);
				cpu.flags.c.should.equal(false);
				cpu.flags.v.should.equal(true);

				instructions.ADC.execute(context, 122);
				cpu.flags.c.should.equal(true);
				cpu.flags.v.should.equal(false);
			});
		});
	});
});
