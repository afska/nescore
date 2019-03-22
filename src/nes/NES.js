import CPU from "./cpu";
import PPU from "./ppu";
import Cartridge from "./cartridge";
import { WithContext } from "./helpers";

/** The NES Emulator. */
export default class NES {
	constructor(display, logger = null) {
		WithContext.apply(this);

		this.display = display;
		this.logger = logger;

		this.masterCycle = 0;
		this.cpu = new CPU();
		this.ppu = new PPU();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom, logger = null) {
		const cartridge = new Cartridge(rom);

		this.loadContext({
			display: this.display,
			logger: this.logger,

			cpu: this.cpu,
			ppu: this.ppu,

			memory: this.cpu.memory,
			ppuMemory: this.ppu.memory,

			cartridge,
			mapper: cartridge.createMapper()
		});
	}

	/** // TODO: Figure out this. */
	frame(cycles) {
		this.masterCycle += cycles;

		this.cpu.stepTo(this.masterCycle);
		this.ppu.stepTo(this.masterCycle);
	}

	/** Executes a step in the emulation. */
	/** // TODO: Delete this method and use `frame`. **/
	step() {
		this.cpu.step();
		this.ppu.step();
	}

	/** Unloads the current cartridge. */
	unload() {
		this.unloadContext();
	}

	/** When a context is loaded. */
	onLoad(context) {
		this._reset();
		this.cpu.loadContext(this.context);
		this.ppu.loadContext(this.context);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.ppu.unloadContext();
		this.cpu.unloadContext();
	}

	_reset() {
		this.masterCycle = 0;
	}
}
