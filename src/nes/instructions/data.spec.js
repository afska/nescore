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
        cpu.registers.a.value.should.equal(5);
        cpu.flags.z.should.equal(false);
        cpu.flags.n.should.equal(false);
      });

      it("with negative value", () => {
        const value = signedByte.toByte(-5);
        instructions.LDA.execute(cpu, value);
        cpu.registers.a.value.should.equal(value);
        cpu.flags.z.should.equal(false);
        cpu.flags.n.should.equal(true);
      });

      it("with zero value", () => {
        instructions.LDA.execute(cpu, 0);
        cpu.registers.a.value.should.equal(0);
        cpu.flags.z.should.equal(true);
        cpu.flags.n.should.equal(false);
      });
    });
  });
});
