import { WithContext } from "./helpers";
import { Register8Bit, Register16Bit, FlagsRegister } from "./registers";
import Stack from "./Stack";
import operations from "./operations";

const INITIAL_FLAGS = 0b00000100;

/** The Center Process Unit. It runs programs. */
export default class CPU {
	constructor() {
		WithContext.apply(this);

		// TODO: Make program counter absolute instead of relative to the prgROM!
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
		this.stack.loadContext(context);
	}

	/** Executes the next operation. */
	step() {
		this.requireContext();

		const opcode = this.context.cartridge.prgROM[this.pc.value];
		const operation = operations[opcode];
		if (!operation) throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
		this.pc.increment();

		let parameter = null;
		const addressing = operation.addressing;
		if (addressing.parameterSize > 0) {
			parameter = this.context.cartridge.prgROM.readUIntLE(
				this.pc.value,
				addressing.parameterSize
			);
			this.pc.value += addressing.parameterSize;
			parameter = addressing.getParameter(this.context, parameter);
		}

		console.log(
			`RUNNING *${operation.instruction.id}*`,
			parameter ? `WITH PARAMETER 0x${parameter.toString(16)}...` : "..."
		);
		operation.instruction.execute(this.context, parameter);
		this.cycles += operation.cycles;
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
}
