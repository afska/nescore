import CPU from "./cpu";
import PPU from "./ppu";
import APU from "./apu";
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
		this.apu = new APU();
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
			apu: this.apu,

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
	frame(onAudioSample) {
		const currentFrame = this.ppu.frame;
		while (this.ppu.frame === currentFrame) this.step(onAudioSample);
		return this.ppu.frameBuffer;
	}

	/** Executes a step in the emulation. */
	step(onAudioSample = () => {}) {
		this.requireContext();

		let cpuCycles = this.cpu.step();
		cpuCycles = this._clockPPU(cpuCycles);
		this._clockAPU(cpuCycles, onAudioSample);
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

	/** When a context is loaded. */
	onLoad(context) {
		context.mapper.loadContext(context);
		this.ppu.loadContext(context);
		this.apu.loadContext(context);
		this.cpu.loadContext(context);
	}

	_clockPPU(cpuCycles) {
		let ppuCycles = cpuCycles * constants.PPU_CYCLES_PER_CPU_CYCLE;
		while (ppuCycles > 0) {
			const interrupt = this.ppu.step();
			ppuCycles--;

			if (interrupt) {
				const newCpuCycles = this.cpu.interrupt(interrupt);
				cpuCycles += newCpuCycles;
				ppuCycles += newCpuCycles * constants.PPU_CYCLES_PER_CPU_CYCLE;
			}
		}

		return cpuCycles;
	}

	_clockAPU(cpuCycles, onAudioSample) {
		const floatApuCycles =
			cpuCycles * constants.APU_CYCLES_PER_CPU_CYCLE + this.apu.pendingCycles;
		const intApuCycles = Math.ceil(floatApuCycles);
		this.apu.pendingCycles = -(intApuCycles - floatApuCycles);

		let apuCycles = intApuCycles;
		while (apuCycles > 0) {
			this.apu.step(onAudioSample);
			apuCycles--;
		}
	}
}
