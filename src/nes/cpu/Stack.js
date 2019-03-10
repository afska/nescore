import { WithContext, Byte } from "../helpers";

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
		this.context.cpu.sp.decrement();
	}

	/** Pulls a value from the stack. */
	pop() {
		this.requireContext();

		this.context.cpu.sp.increment();
		return this.context.memory.readAt(this.currentAddress);
	}

	/** Pushes a 16-bit `value` into the stack. */
	push2Bytes(value) {
		const low = Byte.lowPartOf(value);
		const high = Byte.highPartOf(value);
		this.push(high);
		this.push(low);
	}

	/** Pulls a 16-bit `value` from the stack. */
	pop2Bytes(value) {
		const low = this.pop();
		const high = this.pop();

		return Byte.to16Bit(high, low);
	}

	/** Returns the start address of the stack. */
	get startAddress() {
		return START_ADDRESS;
	}

	/** Returns the current address of the stack. */
	get currentAddress() {
		return this.startAddress + this.context.cpu.sp.value;
	}
}
