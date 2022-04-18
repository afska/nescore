import CPU from "./cpu";
import PPU from "./ppu";
import Cartridge from "./cartridge";
import { WithContext } from "./helpers";

/** The NES Emulator. */
export default class NES {
	constructor(logger = null) {
		WithContext.apply(this);

		this.logger = logger;

		this.cpu = new CPU();
		this.ppu = new PPU();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom) {
		const cartridge = new Cartridge(rom);

		this.loadContext({
			logger: this.logger,

			cpu: this.cpu,
			ppu: this.ppu,
			memory: this.cpu.memory, // TODO: Create Bus and read/write to memory through mapper

			cartridge,
			mapper: cartridge.createMapper()
		});
	}

	/** Executes a step in the emulation. */
	step() {
		this.cpu.step();
	}

	/** Unloads the current cartridge. */
	unload() {
		this.unloadContext();
	}

	/** When a context is loaded. */
	onLoad(context) {
		context.mapper.loadContext(context);
		this.cpu.loadContext(context);
		this.ppu.loadContext(context);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.cpu.unloadContext();
		this.ppu.unloadContext();
		context.mapper.unloadContext();
	}
}
