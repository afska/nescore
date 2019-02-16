import { WithContext } from "./context";
import { Register8Bit, Register16Bit, FlagsRegister } from "./registers";
import operations from "./operations";

const INITIAL_FLAGS = 0b00000100;

/** The Center Process Unit. It runs programs. */
export default class CPU {
	constructor() {
		WithContext.apply(this);

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

	/** Executes the next operation. */
	step() {
		this.requireContext();

		const opcode = this.context.cartridge.prgROM[this.pc.value];
		this.pc.value++;

		const operation = operations[opcode];
		if (!operation) throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
		const parameterSize = operation.addressing.parameterSize;

		let parameter = null;
		if (parameterSize > 0) {
			parameter = this.context.cartridge.prgROM.readUIntLE(
				this.pc.value,
				parameterSize
			);
			this.pc.value += parameterSize;
		}

		console.log(
			`RUNNING *${operation.instruction.id}*`,
			parameter ? `WITH PARAMETER *${parameter}*...` : "..."
		);
		operation.instruction.execute(this.context, parameter);
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.flags.load(INITIAL_FLAGS);
	}

	/** When the current context is unloaded. */
	onUnload() {
		// TODO: Reset registers and flags
	}
}
