import Register from "./Register";

/** An 8-bit register. */
export class Register8Bit extends Register {
	constructor(initialValue) {
		super(new Uint8Array(1), initialValue);
	}
}

/** A 16-bit register. */
export class Register16Bit extends Register {
	constructor(initialValue) {
		super(new Uint16Array(1), initialValue);
	}
}
