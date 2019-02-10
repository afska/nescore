export default class CPU {
  constructor() {
    this.isRunning = false;
    this.pc = null;

    this.registers = {
      x: 0,
      y: 0,
      a: 0
    };
  }
}
