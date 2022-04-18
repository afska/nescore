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
				const currentValue = this.readAt(0);
				return Byte.getSubNumber(currentValue, startPosition, size);
			},
			set(value) {
				const currentValue = this.readAt(0);
				this.writeAt(
					0,
					Byte.setSubNumber(currentValue, startPosition, size, value)
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
