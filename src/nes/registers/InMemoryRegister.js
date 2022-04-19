import { Byte } from "../helpers";

/** A 8-bit register with multiple status flags and values that live in RAM. */
export default class InMemoryRegister {
	constructor() {
		this.memorySize = 1;
		this._value = 0;
	}

	// Adds a field of `size` bits named `named`, starting at `startPosition`.
	addField(name, startPosition, size = 1) {
		Object.defineProperty(this, name, {
			get() {
				return Byte.getSubNumber(this._value, startPosition, size);
			},
			set(value) {
				this._value = Byte.force8Bit(
					0,
					Byte.setSubNumber(this._value, startPosition, size, value)
				);
			}
		});

		return this;
	}

	/** Returns the actual value. */
	readAt(address) {
		return this._value;
	}

	/** Sets the actual value. */
	writeAt(address, byte) {
		byte = Byte.force8Bit(byte);

		this._value = byte;
	}
}
