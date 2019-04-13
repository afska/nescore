import CPU from "./cpu";
import Cartridge from "./cartridge";
import { WithContext } from "./helpers";

/** The NES Emulator. */
export default class NES {
	constructor(logger = null) {
		WithContext.apply(this);

		this.logger = logger;

		this.cpu = new CPU();
	}

	/** Loads a `rom` as the current cartridge. */
	load(rom, logger = null) {
		const cartridge = new Cartridge(rom);

		this.loadContext({
			logger: this.logger,

			cpu: this.cpu,
			memory: this.cpu.memory,

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
		this.cpu.loadContext(this.context);
		this._reset();
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
	}

	_reset() {}
}
