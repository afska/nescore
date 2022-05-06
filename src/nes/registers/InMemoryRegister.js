import { WithContext, Byte } from "../helpers";

/** An 8-bit register with multiple status flags and values that live in RAM. */
export default class InMemoryRegister {
	constructor() {
		WithContext.apply(this);

		this.memorySize = 1;
		this.value = 0;
	}

	/** Adds a field of `size` bits named `named`, starting at `startPosition`. */
	addField(name, startPosition, size = 1) {
		Object.defineProperty(this, name, {
			get() {
				return Byte.getSubNumber(this.value, startPosition, size);
			},
			set(value) {
				this.value = Byte.force8Bit(
					Byte.setSubNumber(this.value, startPosition, size, value)
				);
			}
		});

		return this;
	}

	/** Returns the actual value. */
	readAt() {
		return this.value;
	}

	/** Sets the actual value. */
	writeAt(__, byte) {
		this.value = Byte.force8Bit(byte);
	}
}
