import { WithContext } from "./helpers";
import { Register8Bit, Register16Bit, FlagsRegister } from "./registers";
import Stack from "./Stack";
import operations from "./operations";

const INITIAL_FLAGS = 0b00100100;
const INTERRUPT_CYCLES = 7;
const INTERRUPT_VECTORS = {
	NMI: 0xfffa, // Non-maskable interrupt (used to detect vertical blanking)
	RESET: 0xfffc, // Reset
	IRQ: 0xfffe // Interrupt request (temporarily stops the current program, and run an interrupt handler instead)
};

/** The Center Process Unit. It runs programs. */
export default class CPU {
	constructor() {
		WithContext.apply(this);

		this.pc = new Register16Bit(); // program counter
		this.sp = new Register8Bit(); // stack pointer
		this.flags = new FlagsRegister();
		this.cycles = 0;

		this.registers = {
			a: new Register8Bit(0), // accumulator
			x: new Register8Bit(0), // index X
			y: new Register8Bit(0) // index Y
		};

		this.stack = new Stack();

		this._parameter = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.stack.loadContext(context);
		this._reset();
	}

	/** Executes the next operation. */
	step() {
		this.requireContext();

		const pc = this.pc.value;
		const operation = this._readOperation();
		const parameter = this._readParameter(operation);

		if (this.context.logger)
			this.context.logger.log({
				context: this.context,
				pc,
				operation,
				initialParameter: this._parameter,
				finalParameter: parameter
			});

		operation.instruction.execute(this.context, parameter);
		this.cycles += operation.cycles;
	}

	/**
	 * Pushes the context to the stack and jumps to the interrupt handler.
	 * The flags pushed to the stack always have the B1 flag set, while B2 depends on `flagsMask`.
	 */
	interrupt(type, flagsMask = 0) {
		if (type === "IRQ" && !this._areInterruptsEnabled) return;

		this.stack.push2Bytes(this.pc.value);
		this.stack.push(this.flags.toByte() | flagsMask);

		this.cycles += INTERRUPT_CYCLES;

		this.flags.i = true; // (to make sure handler doesn't get interrupted)
		this._jumpToInterruptHanlder(type);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.stack.unloadContext();
		this._reset();
	}

	_reset() {
		this.pc.reset();
		this.sp.reset();
		this.flags.load(INITIAL_FLAGS);
		this.cycles = 0;
		this.registers.a.reset();
		this.registers.x.reset();
		this.registers.y.reset();
		this._parameter = null;

		this.interrupt("RESET");
	}

	_readOperation() {
		const opcode = this.context.memory.readAt(this.pc.value);
		const operation = operations[opcode];
		if (!operation) throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
		this.pc.increment();

		return operation;
	}

	_readParameter({ instruction, addressing, canTakeExtraCycles }) {
		if (addressing.parameterSize === 0) return null;

		const parameter = this.context.memory.readBytesAt(
			this.pc.value,
			addressing.parameterSize
		);
		this.pc.value += addressing.parameterSize;
		this._parameter = parameter;

		return instruction.needsValue
			? addressing.getValue(this.context, parameter, canTakeExtraCycles)
			: addressing.getAddress(this.context, parameter, canTakeExtraCycles);
	}

	_jumpToInterruptHanlder(type) {
		const interruptVector = INTERRUPT_VECTORS[type];
		if (!interruptVector) throw new Error(`Unknown interrupt: ${type}`);

		this.pc.value = this.context.memory.read2BytesAt(interruptVector);
	}

	get _areInterruptsEnabled() {
		return !this.flags.i;
	}
}
