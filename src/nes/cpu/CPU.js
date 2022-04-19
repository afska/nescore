import { WithContext } from "../helpers";
import { Register8Bit, Register16Bit } from "../registers";
import FlagsRegister from "./FlagsRegister";
import CPUMemoryMap from "./CPUMemoryMap";
import Stack from "./Stack";
import operations from "./operations";
import { interrupts } from "./constants";

const INITIAL_FLAGS = 0b00100100;
const INTERRUPT_CYCLES = 7;

/** The Center Processing Unit. It runs programs. */
export default class CPU {
	constructor() {
		WithContext.apply(this);

		this.pc = new Register16Bit(); //    -> program counter
		this.sp = new Register8Bit(); //     -> stack pointer
		this.flags = new FlagsRegister(); // -> also called "P" register
		this.cycle = 0; //                   -> current cycle
		this.extraCycles = 0; //             -> pending cycles (to add in next step)

		this.registers = {
			a: new Register8Bit(0), // accumulator
			x: new Register8Bit(0), // index X
			y: new Register8Bit(0) // index Y
		};

		this.memory = new CPUMemoryMap();
		this.stack = new Stack();

		this._argument = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.stack.loadContext(context);
		this._reset();
	}

	/** Executes the next operation. */
	step() {
		this.requireContext();

		const pc = this.pc.value;
		const operation = this._readOperation();
		const argument = this._readArgument(operation);

		if (this.context.logger)
			this.context.logger.log({
				context: this.context,
				pc,
				operation,
				initialArgument: this._argument,
				finalArgument: argument
			});

		operation.instruction.execute(this.context, argument);
		const cycles = operation.cycles + this.extraCycles;
		this.cycle += cycles;
		this.extraCycles = 0;

		return cycles;
	}

	/** Pushes the context to the stack and jumps to the interrupt handler. */
	interrupt(interrupt, withB2Flag) {
		if (interrupt.id === "IRQ" && !this._areInterruptsEnabled) return;

		this.stack.push2Bytes(this.pc.value);
		this.pushFlags(withB2Flag);

		this.cycle += INTERRUPT_CYCLES;

		this.flags.i = true; // (to make sure handler doesn't get interrupted)
		this._jumpToInterruptHandler(interrupt);
	}

	/**
	 * Pushes the flags to the stack.
	 * B1 (bit 5) is always on, while B2 (bit 4) depends on `withB2Flag`.
	 */
	pushFlags(withB2Flag = false) {
		this.stack.push(this.flags.toByte() | (withB2Flag && 0b00010000));
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.stack.unloadContext();
		this.memory.unloadContext();
	}

	_reset() {
		this.pc.reset();
		this.sp.reset();
		this.flags.load(INITIAL_FLAGS);
		this.cycle = 0;
		this.extraCycles = 0;
		this.registers.a.reset();
		this.registers.x.reset();
		this.registers.y.reset();
		this._argument = null;

		this.interrupt(interrupts.RESET);
	}

	_readOperation() {
		const opcode = this._memoryBus.readAt(this.pc.value);
		const operation = operations[opcode];
		if (!operation) throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
		this.pc.increment();

		return operation;
	}

	_readArgument({ instruction, addressing, canTakeExtraCycles }) {
		const argument = this._memoryBus.readBytesAt(
			this.pc.value,
			addressing.parameterSize
		);
		this.pc.value += addressing.parameterSize;
		this._argument = argument;

		return instruction.needsValue
			? addressing.getValue(this.context, argument, canTakeExtraCycles)
			: addressing.getAddress(this.context, argument, canTakeExtraCycles);
	}

	_jumpToInterruptHandler(interrupt) {
		this.pc.value = this._memoryBus.read2BytesAt(interrupt.vector);
	}

	get _memoryBus() {
		return this.context.memoryBus.cpu;
	}

	get _areInterruptsEnabled() {
		return !this.flags.i;
	}
}
