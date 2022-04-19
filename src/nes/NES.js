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

	/** Executes a whole frame in the emulation. */
	frame() {
		const currentFrame = this.ppu.frame;
		while (this.ppu.frame === currentFrame) this.step();
		// TODO: RETURN FRAME BUFFER
	}

	/** Executes a step in the emulation. */
	step() {
		const cycles = this.cpu.step();

		// (PPU clock is three times faster than CPU clock)
		for (let i = 0; i < cycles * 3; i++) this.ppu.step();
	}

	/** Unloads the current cartridge. */
	unload() {
		this.unloadContext();
	}

	/** When a context is loaded. */
	onLoad(context) {
		context.mapper.loadContext(context);
		this.ppu.loadContext(context);
		this.cpu.loadContext(context);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.cpu.unloadContext();
		this.ppu.unloadContext();
		this.context.mapper.unloadContext();
	}
}
