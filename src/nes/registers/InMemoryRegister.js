import { Byte } from "../helpers";

/** A 8-bit register with multiple status flags and values that live in RAM. */
export default class InMemoryRegister {
	constructor(memory, address) {
		this.memory = memory;
		this.address = address;
	}

	// Adds a field of `size` bits named `named`, starting at `startPosition`.
	addField(name, startPosition, size = 1) {
		Object.defineProperty(this, name, {
			get() {
				return Byte.getSubNumber(this.value, startPosition, size);
			},
			set(value) {
				this.value = Byte.setSubNumber(this.value, startPosition, size, value);
			}
		});

		return this;
	}

	/** Returns the actual value. */
	get value() {
		return this.memory.readAt(this.address);
	}

	/** Sets the actual value. */
	set value(value) {
		value = Byte.force8Bit(value);

		this.memory.writeAt(this.address, value);
	}
}
