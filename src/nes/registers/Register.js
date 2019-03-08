/** A CPU register that can handle overflows and underflows. */
export default class Register {
	constructor(TypedArray, initialValue = 0) {
		this.bytes = new TypedArray(1);
		this.value = this.initialValue = initialValue;
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

	/** Returns the actual value. */
	get value() {
		return this.bytes[0];
	}

	/** Sets the actual value. */
	set value(value) {
		this.bytes[0] = value;
	}

	toString() {
		return "[REGISTER]";
	}
}
