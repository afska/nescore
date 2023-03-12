import { Register8Bit, Register16Bit, FlagsRegister } from "./registers";
import CPUMemoryMap from "./CPUMemoryMap";
import Stack from "./Stack";
import operations from "./operations";
import { interrupts } from "./constants";
import constants from "../constants";
import { WithContext } from "../helpers";

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

	/** Executes the next step (1 step = 1 instruction = N cycles). Returns N. */
	step() {
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
		if (interrupt.id === "IRQ" && !this._areInterruptsEnabled) return 0;

		this.stack.push2Bytes(this.pc.value);
		this.pushFlags(withB2Flag);

		this.cycle += constants.CPU_INTERRUPT_CYCLES;

		this.flags.i = true; // (to make sure handler doesn't get interrupted)
		this._jumpToInterruptHandler(interrupt);

		return constants.CPU_INTERRUPT_CYCLES;
	}

	/**
	 * Pushes the flags to the stack.
	 * B1 (bit 5) is always on, while B2 (bit 4) depends on `withB2Flag`.
	 */
	pushFlags(withB2Flag = false) {
		this.stack.push(this.flags.toByte() | (withB2Flag && 0b00010000));
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			pc: this.pc.value,
			sp: this.sp.value,
			flags: this.flags.toByte(),
			cycle: this.cycle,
			a: this.registers.a.value,
			x: this.registers.x.value,
			y: this.registers.y.value,
			memory: this.memory.getSaveState()
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.pc.value = saveState.pc;
		this.sp.value = saveState.sp;
		this.flags.load(saveState.flags);
		this.cycle = saveState.cycle;
		this.registers.a.value = saveState.a;
		this.registers.x.value = saveState.x;
		this.registers.y.value = saveState.y;
		this.memory.setSaveState(saveState.memory);
	}

	_reset() {
		this.pc.reset();
		this.sp.reset();
		this.flags.load(constants.CPU_INITIAL_FLAGS);
		this.cycle = 0;
		this.extraCycles = 0;
		this.registers.a.reset();
		this.registers.x.reset();
		this.registers.y.reset();
		this._argument = null;

		this.interrupt(interrupts.RESET);
	}

	_readOperation() {
		const opcode = this.memory.readAt(this.pc.value);
		const operation = operations[opcode];
		if (!operation)
			throw new Error(`Unknown opcode: 0x${opcode.toString(16)}.`);
		this.pc.increment();

		return operation;
	}

	_readArgument({ instruction, addressing, canTakeExtraCycles }) {
		const argument = this.memory.readBytesAt(
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
		this.pc.value = this.memory.read2BytesAt(interrupt.vector);
	}

	get _areInterruptsEnabled() {
		return !this.flags.i;
	}
}
