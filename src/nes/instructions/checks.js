const instructions = () => [
  /**
   * Bit Test
   *
   * Tests if one or more bits are set in a target memory location.
   * The mask pattern in A is ANDed with the value in memory to set
   * or clear the zero flag, but the result is not kept.
   * Bits 7 and 6 of the value from memory are copied into the N and V flags.
   */
  {
    id: "BIT",
    execute: ({ cpu, memory }, address) => {
      const value = memory.readAt(address);
      const mask = cpu.registers.a.value;
      const result = value & mask;

      cpu.flags.updateZero(result);
      cpu.flags.updateNegative(value);
      cpu.flags.v = !!(value & 0b01000000);
    }
  }
];

export default instructions();
