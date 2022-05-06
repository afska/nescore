import Register from "./Register";
import FlagsRegister from "./FlagsRegister";

/** An 8-bit register. */
export class Register8Bit extends Register {
	constructor(initialValue) {
		super(Uint8Array, initialValue);
	}
}

/** A 16-bit register. */
export class Register16Bit extends Register {
	constructor(initialValue) {
		super(Uint16Array, initialValue);
	}
}

export { FlagsRegister };
