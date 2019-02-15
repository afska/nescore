import CPU from "./CPU";
import { RAM } from "./memory";
import GameCartridge from "./GameCartridge";
import ExecutionContext from "./ExecutionContext";

/* The NES Emulator. */
export default class NES {
	constructor() {
		this.cpu = new CPU();
		this.ram = new RAM();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom) {
		this.cpu.load(
			new ExecutionContext({
				cpu: this.cpu,
				ram: this.ram,
				cartridge: new GameCartridge(rom)
			})
		);
	}

	/** Executes a step in the emulation. */
	step() {
		this.cpu.step();
	}

	/** Unloads the current cartridge. */
	unload() {
		this.cpu.unload();
	}

	get context() {
		return this.cpu.context;
	}
}
