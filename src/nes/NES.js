import CPU from "./cpu";
import { MemoryMap } from "./memory";
import PPU from "./ppu";
import Cartridge from "./cartridge";
import { WithContext } from "./helpers";

/** The NES Emulator. */
export default class NES {
	constructor() {
		WithContext.apply(this);

		this.cpu = new CPU();
		this.ppu = new PPU();
		this.memory = new MemoryMap();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom, logger = null) {
		const cartridge = new Cartridge(rom);

		this.loadContext({
			logger,
			cpu: this.cpu,
			memory: this.memory,
			cartridge,
			mapper: cartridge.createMapper()
		});

		this.memory.loadContext(this.context);
		this.cpu.loadContext(this.context);
	}

	/** Executes a step in the emulation. */
	step() {
		this.cpu.step();
		this.ppu.step();
	}

	/** Unloads the current cartridge. */
	unload() {
		this.unloadContext();

		this.cpu.unloadContext();
		this.memory.unloadContext();
	}
}
