import instructions from ".";
import CPU from "../CPU";
import { signedByte } from "../helpers";
const should = require("chai").Should();

describe("instructions", () => {
  describe("data", () => {
    describe("LDA", () => {
      // TODO: Integrate `signedByte` with `Register`?

      it("with positive value", () => {
        const cpu = new CPU();

        instructions.LDA.execute(cpu, signedByte.toByte(5));
        cpu.registers.a.value.should.eql(5);
        cpu.flags.z.should.eql(false);
        cpu.flags.n.should.eql(false);
      });

      it("with negative value", () => {
        const cpu = new CPU();

        instructions.LDA.execute(cpu, signedByte.toByte(-5));
        signedByte.toNumber(cpu.registers.a.value).should.eql(-5);
        cpu.flags.z.should.eql(false);
        cpu.flags.n.should.eql(true);
      });

      it("with zero value", () => {
        const cpu = new CPU();

        instructions.LDA.execute(cpu, signedByte.toByte(0));
        signedByte.toNumber(cpu.registers.a.value).should.eql(0);
        cpu.flags.z.should.eql(true);
        cpu.flags.n.should.eql(false);
      });
    });
  });
});
