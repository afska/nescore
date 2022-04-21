import { PPURegisterSegment } from "./registers";
import PPUMemoryMap from "./PPUMemoryMap";
import pipeline from "./pipeline";
import { NameTable, PatternTable } from "./renderers";
import { getScanlineType } from "./constants";
import { MemoryChunk } from "../memory";
import { WithContext } from "../helpers";

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
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

		this.frameBuffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
		this.nameTable = new NameTable();
		this.patternTable = new PatternTable();
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.oamRam = new MemoryChunk(PRIMARY_OAM_SIZE);
		this.oamRam2 = new MemoryChunk(SECONDARY_OAM_SIZE);
		this.registers = new PPURegisterSegment(context);
		this.nameTable.loadContext(context);
		this.patternTable.loadContext(context);
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

	/** Draws a pixel in (`x`, `y`) using `color`. */
	plot(x, y, color) {
		this.frameBuffer[y * SCREEN_WIDTH + x] = color;
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.memory.unloadContext();
		this.oamRam = null;
		this.oamRam2 = null;
		this.registers = null;
		this.nameTable.unloadContext();
		this.patternTable.unloadContext();
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

		for (let i = 0; i < this.frameBuffer.length - 1; i++)
			this.frameBuffer[i] = 0;
	}

	get _isRenderingEnabled() {
		return (
			this.registers.ppuMask.showBackground ||
			this.registers.ppuMask.showSprites
		);
	}
}
