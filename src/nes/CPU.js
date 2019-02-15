import { Register8Bit, Register16Bit } from "./registers";
import { signedByte } from "./helpers";

/** The Center Process Unit. It runs programs. */
export default class CPU {
	constructor() {
		this.currentProgram = null;

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
			c: false, // carry

			updateZeroAndNegative(value) {
				if (signedByte.isZero(value)) this.z = true;
				if (signedByte.isNegative(value)) this.n = true;
			}
		};
	}

	/** Loads a `program`. */
	load(program) {
		this.currentProgram = program;
	}

	/** Unloads the current program. */
	reset() {
		this.currentProgram = null;
	}
}
