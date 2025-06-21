import CPU from "./cpu";
import PPU from "./ppu";
import APU from "./apu";
import { CPUBus } from "./memory/Bus";
import Cartridge from "./cartridge";
import Controller from "./controller";
import constants from "./constants";
import { WithContext } from "./helpers";

/** The NES Emulator. */
export default class NES {
	constructor(onFrame = () => {}, onSample = () => {}, logger = null) {
		WithContext.apply(this);

		this.onFrame = onFrame;
		this.onSample = (sample) => {
			this.sampleCount++;
			onSample(sample);
		};
		this.logger = logger;

		this.cpu = new CPU();
		this.ppu = new PPU();
		this.apu = new APU();

		this.sampleCount = 0;
		this.pendingPPUCycles = 0;
		this.pendingAPUCycles = 0;
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
				cpu: new CPUBus(mapper)
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
		this.requireContext();

		const currentFrame = this.ppu.frame;
		while (this.ppu.frame === currentFrame) this.step();
	}

	/** Runs the emulation until the audio system generates `requestedSamples`. */
	samples(requestedSamples) {
		this.requireContext();

		this.sampleCount = 0;

		while (this.sampleCount < requestedSamples) this.step();
	}

	/** Runs the emulation until the next scanline. */
	scanline(debug = false) {
		this.requireContext();

		const currentScanline = this.ppu.scanline;
		while (this.ppu.scanline === currentScanline) this.step();

		let oldFrameBuffer;
		if (debug) {
			oldFrameBuffer = new Uint32Array(this.ppu.frameBuffer.length);
			for (let i = 0; i < this.ppu.frameBuffer.length; i++)
				oldFrameBuffer[i] = this.ppu.frameBuffer[i];
			for (let i = 0; i < constants.SCREEN_WIDTH; i++)
				this.ppu.plot(i, this.ppu.scanline, 0xff0000ff);
		}

		this.onFrame(this.ppu.frameBuffer);

		if (debug) {
			for (let i = 0; i < this.ppu.frameBuffer.length; i++)
				this.ppu.frameBuffer[i] = oldFrameBuffer[i];
		}
	}

	/** Executes a step in the emulation (1 CPU instruction). */
	step() {
		let cpuCycles = this.cpu.step();
		cpuCycles = this._clockPPU(cpuCycles);
		this._clockAPU(cpuCycles);
	}

	/** Sets the `button` state of `player` to `isPressed`. */
	setButton(player, button, isPressed) {
		this.requireContext();
		if (player !== 1 && player !== 2)
			throw new Error(`Invalid player: ${player}.`);

		this.context.controllers[player - 1].update(button, isPressed);
	}

	/** Sets all buttons of `player` to a non-pressed state. */
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

		const bytes = [];
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
			mapper: this.context.mapper.getSaveState(),
			saveFile: this.getSaveFile()
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.requireContext();

		this.cpu.setSaveState(saveState.cpu);
		this.ppu.setSaveState(saveState.ppu);
		this.apu.setSaveState(saveState.apu);
		this.context.mapper.setSaveState(saveState.mapper);
		this._setSaveFile(saveState.saveFile);
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.pendingPPUCycles = 0;
		this.pendingAPUCycles = 0;

		context.mapper.loadContext(context);
		this.ppu.loadContext(context);
		this.apu.loadContext(context);
		this.cpu.loadContext(context);
	}

	_clockPPU(cpuCycles) {
		let unitCycles =
			this.pendingPPUCycles + cpuCycles * constants.PPU_STEPS_PER_CPU_CYCLE;
		this.pendingPPUCycles = 0;

		this.ppu.step(unitCycles, this.onFrame, (interrupt) => {
			const newCPUCycles = this.cpu.interrupt(interrupt);
			cpuCycles += newCPUCycles;
			this.pendingPPUCycles += newCPUCycles * constants.PPU_STEPS_PER_CPU_CYCLE;
		});

		return cpuCycles;
	}

	_clockAPU(cpuCycles) {
		let unitCycles =
			this.pendingAPUCycles + cpuCycles * constants.APU_STEPS_PER_CPU_CYCLE;

		while (unitCycles >= 1) {
			const interrupt = this.apu.step(this.onSample);
			unitCycles--;

			if (interrupt != null) {
				const newCPUCycles = this.cpu.interrupt(interrupt);
				unitCycles += newCPUCycles * constants.APU_STEPS_PER_CPU_CYCLE;
				this.pendingPPUCycles +=
					newCPUCycles * constants.PPU_STEPS_PER_CPU_CYCLE;
			}
		}

		this.pendingAPUCycles = unitCycles;
	}

	_setSaveFile(prgRamBytes) {
		const { prgRam } = this.context.mapper;
		if (!prgRam) return;

		for (let i = 0; i < prgRamBytes.length; i++)
			prgRam.writeAt(i, prgRamBytes[i]);
	}
}
