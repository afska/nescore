import { Register8Bit, Register16Bit } from "./registers";

export default class CPU {
  constructor() {
    this.isRunning = false;

    this.pc = new Register16Bit(0); // program counter
    this.sp = new Register8Bit(0xff); // stack pointer

    this.registers = {
      a: new Register8Bit(0), // accumulator
      x: new Register8Bit(0), // index X
      y: new Register8Bit(0) // index Y
    };

    this.flags = {
      n: false, // negative
      v: false, // overflow
      b: false, // break command
      d: false, // decimal mode
      i: false, // interrupt disable
      z: false, // zero
      c: false // carry
    };
  }
}
