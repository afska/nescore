import CPU from "./cpu";
import PPU from "./ppu";
import Cartridge from "./cartridge";
import { WithContext } from "./helpers";

/** The NES Emulator. */
export default class NES {
	constructor() {
		WithContext.apply(this);

		this.cpu = new CPU();
		this.ppu = new PPU();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom, logger = null) {
		const cartridge = new Cartridge(rom);

		this.loadContext({
			logger,
			cpu: this.cpu,
			memory: this.cpu.memory,
			ppu: this.ppu,
			cartridge,
			mapper: cartridge.createMapper()
		});
	}

	/** Executes a step in the emulation. */
	step() {
		this.cpu.step(); // TODO: Add cycle counter and PPU sync
		this.ppu.step();
	}

	/** Unloads the current cartridge. */
	unload() {
		this.unloadContext();
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.cpu.loadContext(this.context);
		this.ppu.loadContext(this.context);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.ppu.unloadContext();
		this.cpu.unloadContext();
		this.memory.unloadContext();
	}
}
