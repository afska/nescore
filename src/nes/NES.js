import CPU from "./CPU";
import { MemoryMap } from "./memory";
import GameCartridge from "./GameCartridge";
import { WithContext, ExecutionContext } from "./ExecutionContext";

/* The NES Emulator. */
export default class NES {
	constructor() {
		WithContext.apply(this);

		this.cpu = new CPU();
		this.ram = new RAM();
		this.memoryMap = new MemoryMap();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom) {
		this.loadContext(
			new ExecutionContext({
				cpu: this.cpu,
				ram: this.ram,
				memoryMap: this.memoryMap,
				cartridge: new GameCartridge(rom)
			})
		);

		this.cpu.loadContext(this.context);
		this.memoryMap.loadContext(this.context);
	}

	/** Executes a step in the emulation. */
	step() {
		this.cpu.step();
	}

	/** Unloads the current cartridge. */
	unload() {
		this.unloadContext();
		this.cpu.unloadContext();
	}
}
