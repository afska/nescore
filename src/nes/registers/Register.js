/** A CPU register that can handle overflows and underflows. */
export default class Register {
	constructor(TypedArray, initialValue) {
		this.bytes = new TypedArray(1);
		this.value = this.initialValue = initialValue;
		this.lastWriteOk = true;
	}

	/** Resets the `value` to the `initialValue`. */
	reset() {
		this.value = this.initialValue;
	}

	/** Increments the value. */
	increment() {
		this.value++;
	}

	/** decrements the value. */
	decrement() {
		this.value--;
	}

	/** Throws an `error` if an overflow or underflow has occurred. */
	checkLastWrite(error) {
		if (!this.lastWriteOk) throw new Error(error);
	}

	/** Returns the actual value. */
	get value() {
		return this.bytes[0];
	}

	/** Sets the actual value. */
	set value(value) {
		this.lastWriteOk = true;
		this.bytes[0] = value;
		this.lastWriteOk = this.value === value;
	}

	toString() {
		return "[REGISTER]";
	}
}
