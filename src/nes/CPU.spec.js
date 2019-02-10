import CPU from "./CPU";
const should = require("chai").Should();

describe("CPU", () => {
  it("initializes all variables", () => {
    const cpu = new CPU();

    cpu.isRunning.should.not.ok;
    should.not.exist(cpu.pc);
    cpu.registers.should.eql({
      x: 0,
      y: 0,
      a: 0
    });
  });
});
