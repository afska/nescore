import instructions from ".";
import CPU from "../CPU";
import { signedByte } from "../helpers";
const should = require("chai").Should();

describe("instructions", () => {
  describe("data", () => {
    let cpu = null;

    beforeEach(() => {
      cpu = new CPU();
    });

    describe("LDA", () => {
      it("with positive value", () => {
        instructions.LDA.execute(cpu, 5);
        cpu.registers.a.value.should.eql(5);
        cpu.flags.z.should.eql(false);
        cpu.flags.n.should.eql(false);
      });

      it("with negative value", () => {
        const value = signedByte.toByte(-5);
        instructions.LDA.execute(cpu, value);
        cpu.registers.a.value.should.eql(value);
        cpu.flags.z.should.eql(false);
        cpu.flags.n.should.eql(true);
      });

      it("with zero value", () => {
        instructions.LDA.execute(cpu, 0);
        cpu.registers.a.value.should.eql(0);
        cpu.flags.z.should.eql(true);
        cpu.flags.n.should.eql(false);
      });
    });
  });
});
