import instructions from ".";
import CPU from "../CPU";
const should = require("chai").Should();

describe("instructions", () => {
	describe("logical", () => {
		let cpu = null;

		beforeEach(() => {
			cpu = new CPU();
		});

		describe("AND", () => {
			it("stores the right result", () => {
				cpu.registers.a.value = 0b10100100;
				instructions.AND.execute(cpu, 0b10000100);
				cpu.registers.a.value.should.equal(0b10000100);
				cpu.flags.z = false;
				cpu.flags.n = true;
			});
		});
	});
});
