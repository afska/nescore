import CPU from "./CPU";
import _ from "lodash";
const should = require("chai").Should();

const registersOf = (cpu) => _.mapValues(cpu.registers, (reg) => reg.value);

describe("CPU", () => {
	it("initializes all variables", () => {
		const cpu = new CPU();

		should.not.exist(cpu.context);
		cpu.pc.value.should.equal(0);
		cpu.sp.value.should.equal(0xff);
		cpu.flags.should.include({
			n: false,
			v: false,
			b1: true,
			b2: false,
			d: false,
			i: true,
			z: false,
			c: false
		});
		cpu.cycles.should.equal(0);

		registersOf(cpu).should.include({
			x: 0,
			y: 0,
			a: 0
		});
	});

	// TODO: Test .step(...)
});
