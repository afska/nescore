import { WithContext, Byte } from "../helpers";

/** An 8-bit register with multiple status flags and values that live in RAM. */
export default class InMemoryRegister {
	constructor() {
		WithContext.apply(this);

		this.memorySize = 1;
		this.value = 0;
		this._readOnlyFields = [];
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

	/** Adds a read-only field of `size` bits named `named`, starting at `startPosition`. */
	addReadOnlyField(name, startPosition, size = 1) {
		// (this performs better than `addField`)
		this._readOnlyFields.push({ name, startPosition, size });
		this[name] = 0;

		return this;
	}

	/** Sets the value manually (updating internal accessors). */
	setValue(value) {
		this.value = Byte.force8Bit(value);
		this._writeReadOnlyFields();
	}

	/** Returns the actual value. */
	readAt() {
		return this.value;
	}

	/** Sets the actual value. */
	writeAt(__, byte) {
		this.setValue(byte);
	}

	_writeReadOnlyFields() {
		for (let { name, startPosition, size } of this._readOnlyFields)
			this[name] = Byte.getSubNumber(this.value, startPosition, size);
	}
}
