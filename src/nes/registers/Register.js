/** A CPU register that can handle overflows easily. */
export default class Register {
  constructor(TypedArray, initialValue) {
    this.bytes = new TypedArray(1);
    this.value = this.initialValue = initialValue;
  }

  /** Resets the `value` to the `initialValue`. */
  reset() {
    this.value = this.initialValue;
  }

  /** Returns the actual value. */
  get value() {
    return this.bytes[0];
  }

  /** Sets the actual value. */
  set value(value) {
    this.bytes[0] = value;
  }
}
