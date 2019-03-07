import { WithContext } from "./helpers";
import { Register8Bit, Register16Bit, FlagsRegister } from "./registers";
import Stack from "./Stack";
import operations from "./operations";

const INITIAL_FLAGS = 0b00000100;
const INTERRUPT_VECTORS = {
	NMI: 0xfffa, // Non-maskable interrupt (used to detect vertical blanking)
	RESET: 0x8000, // TODO: Implement -> 0xfffc // Reset
	IRQ: 0xfffe // Interrupt request (temporarily stops the current program, and run an interrupt handler instead)
};

/** The Center Process Unit. It runs programs. */
export default class CPU {
	constructor() {
		WithContext.apply(this);

		this.pc = new Register16Bit(0); // program counter
		this.sp = new Register8Bit(0xff); // stack pointer
		this.flags = new FlagsRegister(INITIAL_FLAGS);
		this.cycles = 0;

		this.registers = {
			a: new Register8Bit(0), // accumulator
			x: new Register8Bit(0), // index X
			y: new Register8Bit(0) // index Y
		};

		this.stack = new Stack();
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.pc.value = INTERRUPT_VECTORS.RESET;
		this.stack.loadContext(context);
	}

	/** Executes the next operation. */
	step() {
		this.requireContext();

		const operation = this._readOperation();
		const parameter = this._readParameter(operation);

		console.log(
			`[$${this.pc.value.toString(16)}] RUNNING *${
				operation.instruction.id
			}* (0x${operation.id.toString(16)})`,
			parameter != null ? `WITH PARAMETER $${parameter.toString(16)}...` : "..."
		);

		operation.instruction.execute(this.context, parameter);
		this.cycles += operation.cycles;
	}

	/** Pushes the context to the stack and jumps to the interrupt handler. */
	interrupt(interruption) {
		// TODO: Test interruptions
		if (interruption === "IRQ" && !this._areInterruptionsEnabled) return;

		this.cycles += 7; // interrupts cost 7 cycles
		// TODO: ^ check this

		this.stack.push2Bytes(this.pc.value);
		this.stack.push(this.flags.toByte());

		this.flags.i = true; // (to make sure handler doesn't get interrupted)
		this._jumpToInterruptHanlder(interruption);

		console.log(
			`*${interruption} INTERRUPTION* - Jumping to $${this.pc.value.toString(
				16
			)}...`
		);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.pc.reset();
		this.sp.reset();
		this.flags.load(INITIAL_FLAGS);
		this.cycles = 0;
		this.registers.a.reset();
		this.registers.x.reset();
		this.registers.y.reset();
		this.stack.unloadContext();
	}

	_readOperation() {
		const opcode = this.context.memory.readAt(this.pc.value);
		const operation = operations[opcode];
		if (!operation) throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
		this.pc.increment();

		return operation;
	}

	_readParameter({ instruction, addressing }) {
		if (addressing.parameterSize === 0) return null;

		const parameter = this.context.memory.readBytesAt(
			this.pc.value,
			addressing.parameterSize
		);
		this.pc.value += addressing.parameterSize;

		return instruction.needsValue
			? addressing.getValue(this.context, parameter)
			: addressing.getAddress(this.context, parameter);
	}

	_jumpToInterruptHanlder(interruption) {
		const interruptVector = INTERRUPT_VECTORS[interruption];
		if (!interruptVector)
			throw new Error(`Unknown interruption: ${interruption}`);

		this.pc.value = this.context.memory.read2BytesAt(interruptVector);
	}
}
