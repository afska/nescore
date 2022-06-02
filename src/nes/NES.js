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
	constructor(
		onFrame = () => {},
		onSample = () => {},
		sampleRate = constants.APU_SAMPLE_RATE,
		logger = null
	) {
		WithContext.apply(this);

		this.onFrame = onFrame;
		this.onSample = onSample;
		this.sampleRate = sampleRate;
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
			nes: this,
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

	/** Runs the emulation for a whole video frame. */
	frame() {
		const currentFrame = this.ppu.frame;
		while (this.ppu.frame === currentFrame)
			this.step(this.onFrame, this.onSample);
	}

	/** Runs the emulation until the audio system generates `requestedSamples`. */
	samples(requestedSamples) {
		let samples = 0;

		const onSample = (sample) => {
			samples++;
			this.onSample(sample);
		};

		while (samples < requestedSamples) this.step(this.onFrame, onSample);
	}

	/** Runs the emulation until the next scanline. */
	scanline() {
		const currentScanline = this.ppu.scanline;
		while (this.ppu.scanline === currentScanline)
			this.step(this.onFrame, this.onSample);
		this.onFrame(this.ppu.frameBuffer);
	}

	/** Executes a step in the emulation (1 CPU instruction). */
	step(onFrame = () => {}, onSample = () => {}) {
		this.requireContext();

		let cpuCycles = this.cpu.step();
		cpuCycles = this._clock(this.ppu, cpuCycles, onFrame);
		// this._clock(this.apu, cpuCycles, onSample);
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

	_clock(unit, cpuCycles, onSomething) {
		let unitCycles = cpuCycles * constants.UNIT_STEPS_PER_CPU_CYCLE;
		while (unitCycles > 0) {
			const interrupt = unit.step(onSomething);
			unitCycles--;

			if (interrupt != null) {
				const newCpuCycles = this.cpu.interrupt(interrupt);
				cpuCycles += newCpuCycles;
				unitCycles += newCpuCycles * constants.UNIT_STEPS_PER_CPU_CYCLE;
			}
		}

		return cpuCycles;
	}
}
