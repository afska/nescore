import { Byte } from "../../helpers";

const N_BIT /*  */ = 0b10000000;
const V_BIT /*  */ = 0b01000000;
const B1_BIT /* */ = 0b00100000;
const D_BIT /*  */ = 0b00001000;
const I_BIT /*  */ = 0b00000100;
const Z_BIT /*  */ = 0b00000010;
const C_BIT /*  */ = 0b00000001;

/** The processor status flags. **/
export default class FlagsRegister {
	constructor() {
		this.n = false; // negative
		this.v = false; // overflow
		this.d = false; // decimal mode
		this.i = false; // interrupt disable
		this.z = false; // zero
		this.c = false; // carry

		// (bits 4 and 5 -also called "B1" and "B2"- are not actual flags)
		// (they only appear when the flags are pushed to the stack)
	}

	/** Deserializes a `byte` into the status flags. **/
	load(byte) {
		this.n = !!(byte & N_BIT);
		this.v = !!(byte & V_BIT);
		this.d = !!(byte & D_BIT);
		this.i = !!(byte & I_BIT);
		this.z = !!(byte & Z_BIT);
		this.c = !!(byte & C_BIT);

		return this;
	}

	/** Serializes the status flags into a byte. **/
	toByte() {
		return (
			(this.n && N_BIT) |
			(this.v && V_BIT) |
			B1_BIT |
			(this.d && D_BIT) |
			(this.i && I_BIT) |
			(this.z && Z_BIT) |
			(this.c && C_BIT)
		);
	}

	/** Updates the Z and N flags depending on a `byte`. */
	updateZeroAndNegative(byte) {
		this.updateZero(byte);
		this.updateNegative(byte);
	}

	/** Updates the Z flag depending on a `byte`. */
	updateZero(byte) {
		this.z = byte === 0;
	}

	/** Updates the N flag depending on a `byte`. */
	updateNegative(byte) {
		this.n = Byte.isNegative(byte);
	}
}
