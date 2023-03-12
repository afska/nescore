import constants from "../constants";
import { WithContext, Byte } from "../helpers";

/** An in-memory stack, controlled by the CPU. */
export default class Stack {
	constructor() {
		WithContext.apply(this);
	}

	/** Pushes a `value` into the stack. */
	push(value) {
		this.context.memoryBus.cpu.writeAt(this.currentAddress, value);
		this.context.cpu.sp.decrement();
	}

	/** Pulls a value from the stack. */
	pop() {
		this.context.cpu.sp.increment();
		return this.context.cpu.memory.readAt(this.currentAddress);
	}

	/** Pushes a 16-bit `value` into the stack. */
	push2Bytes(value) {
		const low = Byte.lowPartOf(value);
		const high = Byte.highPartOf(value);
		this.push(high);
		this.push(low);
	}

	/** Pulls a 16-bit `value` from the stack. */
	pop2Bytes() {
		const low = this.pop();
		const high = this.pop();

		return Byte.to16Bit(high, low);
	}

	/** Returns the current address of the stack. */
	get currentAddress() {
		return constants.CPU_STACK_START_ADDRESS + this.context.cpu.sp.value;
	}
}
