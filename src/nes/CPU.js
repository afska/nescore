import { Register8Bit, Register16Bit, FlagsRegister } from "./registers";
import operations from "./operations";

const INITIAL_FLAGS = 0b00000100;

/** The Center Process Unit. It runs programs. */
export default class CPU {
	constructor() {
		this.currentProgram = null;

		// TODO: Make program counter absolute instead of relative to the prgROM?
		this.pc = new Register16Bit(0); // program counter
		this.sp = new Register8Bit(0xff); // stack pointer
		this.flags = new FlagsRegister();

		this.registers = {
			a: new Register8Bit(0), // accumulator
			x: new Register8Bit(0), // index X
			y: new Register8Bit(0) // index Y
		};
	}

	/** Loads a `program`. */
	load(program) {
		this.currentProgram = program;
		this.flags.load(INITIAL_FLAGS);
	}

	/** Executes a step in the emulation. */
	step() {
		if (!this.currentProgram)
			throw new Error("No program was loaded. Use the `load` method first!");

		const opcode = this.currentProgram[this.pc.value];
		this.pc.value++;

		const operation = operations[opcode];
		if (!operation) throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
		const parameterSize = operation.addressing.parameterSize;

		let parameter = null;
		if (parameterSize > 0) {
			parameter = this.currentProgram.readUIntLE(this.pc.value, parameterSize);
			this.pc.value += parameterSize;
		}

		console.log(
			`RUNNING *${operation.instruction.id}*`,
			parameter ? `WITH PARAMETER *${parameter}*...` : "..."
		);
		operation.instruction.execute(this, parameter);
	}

	/** Unloads the current program. */
	unload() {
		this.currentProgram = null;
		// TODO: Reset registers and flags
	}
}
