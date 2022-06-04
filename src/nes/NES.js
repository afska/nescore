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
	load(rom, saveFileBytes = []) {
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

		this._setSaveFile(saveFileBytes);
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
		this._clock(this.apu, cpuCycles, onSample);
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

	/** Returns the PRG RAM bytes, or null. */
	getSaveFile() {
		this.requireContext();
		const { prgRam } = this.context.mapper;
		if (!prgRam) return null;

		const bytes = new Uint8Array(prgRam.memorySize);
		for (let i = 0; i < prgRam.memorySize; i++) bytes[i] = prgRam.readAt(i);

		return bytes;
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		this.requireContext();

		return {
			cpu: this.cpu.getSaveState(),
			ppu: this.ppu.getSaveState(),
			apu: this.apu.getSaveState(),
			mapper: this.context.mapper.getSaveState()
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.requireContext();

		this.cpu.setSaveState(saveState.cpu);
		this.ppu.setSaveState(saveState.ppu);
		this.apu.setSaveState(saveState.apu);
		this.context.mapper.setSaveState(saveState.mapper);
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

	_setSaveFile(prgRamBytes) {
		const { prgRam } = this.context.mapper;
		if (!prgRam) return;

		for (let i = 0; i < prgRamBytes.length; i++)
			prgRam.writeAt(i, prgRamBytes[i]);
	}
}
