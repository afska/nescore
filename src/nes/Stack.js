import { WithContext } from "./helpers";

const START_ADDRESS = 0x0100;

/** An in-memory stack, controlled by the CPU. */
export default class Stack {
	constructor() {
		WithContext.apply(this);
	}

	/** Pushes a `value` into the stack. */
	push(value) {
		this.requireContext();

		this.context.memory.writeAt(this.currentAddress, value);
		this._decrement();
	}

	/** Pulls a value from the stack. */
	pop() {
		this.requireContext();

		this._increment();
		return this.context.memory.readAt(this.currentAddress);
	}

	/** Pushes a 16-bit `value` into the stack. */
	push2Bytes(value) {
		this.requireContext();

		this.context.memory.write2BytesAt(this.currentAddress, value);
		this._decrement();
		this._decrement();
	}

	/** Pulls a 16-bit `value` from the stack. */
	pop2Bytes(value) {
		this.requireContext();

		this._increment();
		this._increment();
		return this.context.memory.read2BytesAt(this.currentAddress);
	}

	/** Returns the start address of the stack. */
	get startAddress() {
		return START_ADDRESS;
	}

	/** Returns the current address of the stack. */
	get currentAddress() {
		return this.startAddress + this.context.cpu.sp.value;
	}

	_increment() {
		this.context.cpu.sp.increment();
	}

	_decrement() {
		this.context.cpu.sp.decrement();
	}
}
