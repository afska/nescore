import Register from "./Register";

export class Register8Bit extends Register {
  constructor(initialValue) {
    super(Uint8Array, initialValue);
  }
}

export class Register16Bit extends Register {
  constructor(initialValue) {
    super(Uint16Array, initialValue);
  }
}
