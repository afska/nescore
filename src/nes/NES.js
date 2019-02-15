import CPU from "./CPU";
import GameCartridge from "./GameCartridge";

/* The NES Emulator. */
export default class NES {
	constructor() {
		this.cpu = new CPU();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom) {
		this.cpu.load({ cpu: this.CPU, cartridge: new GameCartridge(rom) });
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
