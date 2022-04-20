import CPU from "./cpu";
import PPU from "./ppu";
import { CPUBus, PPUBus } from "./memory/Bus";
import Cartridge from "./cartridge";
import { WithContext } from "./helpers";

const PPU_CYCLES_PER_CPU_CYCLE = 3;

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
		// (PPU clock is three times faster than CPU clock)
		let ppuCycles = this.cpu.step() * PPU_CYCLES_PER_CPU_CYCLE;

		while (ppuCycles > 0) {
			const interrupt = this.ppu.step();
			ppuCycles--;

			if (interrupt)
				ppuCycles += this.cpu.interrupt(interrupt) * PPU_CYCLES_PER_CPU_CYCLE;
		}
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
