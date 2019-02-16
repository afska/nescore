import { WithContext } from "./helpers";

const START_ADDRESS = 0x0100;
const STACK_UNDERFLOW = "Stack underflow.";
const STACK_OVERFLOW = "Stack overflow.";

/** An in-memory stack, controlled by the CPU. */
export default class Stack {
	constructor() {
		WithContext.apply(this);
	}

	// TODO: Test these methods

	/** Pushes a `value` into the stack. */
	push(value) {
		this.requireContext();

		this.context.memory.writeAt(this.currentAddress, value);
		this.context.cpu.sp.decrement();
		this.context.cpu.sp.checkLastWrite(STACK_OVERFLOW);
	}

	/** Pops a value from the stack. */
	pop() {
		this.requireContext();

		this.context.cpu.sp.increment();
		this.context.cpu.sp.checkLastWrite(STACK_UNDERFLOW);
		return this.context.memory.readAt(this.currentAddress);
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
