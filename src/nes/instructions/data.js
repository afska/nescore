/**
 * Load Accumulator
 *
 * Loads `value` into A, setting the Z (zero) and N (negative) flags.
 */
const LDA = {
  name: "LDA",
  execute(cpu, value) {
    cpu.registers.a.value = value;
    if (value === 0) cpu.flags.z = true;
    if (value & 0b10000000) cpu.flags.n = true;
  }
};

export default [LDA];
