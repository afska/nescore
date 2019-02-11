export default class Register {
  constructor(TypedArray, initialValue) {
    this.bytes = new TypedArray(1);
    this.initialValue = initialValue;
    this.reset();
  }

  reset() {
    this.value = this.initialValue;
  }

  get value() {
    return this.bytes[0];
  }

  set value(value) {
    this.bytes[0] = value;
  }
}
