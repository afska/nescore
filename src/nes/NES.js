import CPU from "./cpu";
import PPU from "./ppu";
import { CPUBus, PPUBus } from "./memory/Bus";
import Cartridge from "./cartridge";
import Controller from "./controller";
import constants from "./constants";
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
		const mapper = cartridge.createMapper();

		const controllerPorts = Controller.createPorts();

		this.loadContext({
			logger: this.logger,

			cpu: this.cpu,
			ppu: this.ppu,

			memoryBus: {
				cpu: new CPUBus(mapper),
				ppu: new PPUBus(mapper)
			},

			cartridge,
			mapper,

			controllers: [
				new Controller(controllerPorts.primary),
				new Controller(controllerPorts.secondary)
			],

			inDebugMode(action) {
				try {
					this.isDebugging = true;
					return action();
				} finally {
					this.isDebugging = false;
				}
			}
		});
	}

	/** Executes a whole frame in the emulation. */
	frame() {
		const currentFrame = this.ppu.frame;
		while (this.ppu.frame === currentFrame) this.step();
		return this.ppu.frameBuffer;
	}

	/** Executes a step in the emulation. */
	step() {
		this.requireContext();

		// (PPU clock is three times faster than CPU clock)
		let ppuCycles = this.cpu.step() * constants.PPU_CYCLES_PER_CPU_CYCLE;

		while (ppuCycles > 0) {
			const interrupt = this.ppu.step();
			ppuCycles--;

			if (interrupt)
				ppuCycles +=
					this.cpu.interrupt(interrupt) * constants.PPU_CYCLES_PER_CPU_CYCLE;
		}
	}

	/** Sets the `button` state of `player` to `isPressed`. */
	setButton(player, button, isPressed) {
		this.requireContext();
		if (player !== 1 && player !== 2)
			throw new Error(`Invalid player: ${player}.`);

		this.context.controllers[player - 1].update(button, isPressed);
	}

	/** Sets all buttons of `player` to a not pressed state. */
	clearButtons(player) {
		this.requireContext();
		if (player !== 1 && player !== 2)
			throw new Error(`Invalid player: ${player}.`);

		this.context.controllers[player - 1].clear();
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
