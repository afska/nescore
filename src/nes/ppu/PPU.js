import { PPURegisterSegment } from "./registers";
import PPUMemoryMap from "./PPUMemoryMap";
import pipeline from "./pipeline";
import { getScanlineType } from "./constants";
import { MemoryChunk } from "../memory";
import { WithContext } from "../helpers";

const PRIMARY_OAM_SIZE = 256;
const SECONDARY_OAM_SIZE = 32;
const LAST_CYCLE = 340;
const LAST_SCANLINE = 260;

/** The Picture Processing Unit. It generates a video signal of 256x240 pixels. */
export default class PPU {
	constructor() {
		WithContext.apply(this);

		this.frame = 0;
		this.scanline = 0;
		this.cycle = 0;

		this.memory = new PPUMemoryMap();
		this.oamRam = null; // OAM = Object Attribute Memory (contains sprite data)
		this.oamRam2 = null;
		this.registers = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.oamRam = new MemoryChunk(PRIMARY_OAM_SIZE);
		this.oamRam2 = new MemoryChunk(SECONDARY_OAM_SIZE);
		this.registers = new PPURegisterSegment(context);
		this._reset();
	}

	/** Executes the next operation. */
	step() {
		this.requireContext();

		const scanlineType = getScanlineType(this.scanline);
		const interrupt = pipeline[scanlineType](this.context);

		this._incrementCounters();

		return interrupt;
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.memory.unloadContext();
		this.oamRam = null;
		this.oamRam2 = null;
		this.registers = null;
	}

	_incrementCounters() {
		this.cycle++;
		if (this.cycle > LAST_CYCLE) {
			this.cycle = 0;
			this.scanline++;

			if (this.scanline > LAST_SCANLINE) {
				this.scanline = -1;
				this.frame++;
			}
		}
	}

	_reset() {
		this.frame = 0;
		this.scanline = -1;
		this.cycle = 0;

		this.registers.ppuStatus.reset();
	}

	get _isRenderingEnabled() {
		return (
			this.registers.ppuMask.showBackground ||
			this.registers.ppuMask.showSprites
		);
	}
}
