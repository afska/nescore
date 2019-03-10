/** A CPU register that can handle overflows and underflows. */
export default class Register {
	constructor(typedArray, initialValue = 0) {
		if (typedArray.length !== 1)
			throw new Error("The typed array must have exactly one element");

		this.bytes = typedArray;
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
