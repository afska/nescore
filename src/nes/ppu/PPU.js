import { PPURegisterSegment } from "./registers";
import PPUMemoryMap from "./PPUMemoryMap";
import renderers from "./renderers";
import {
	NameTable,
	AttributeTable,
	PatternTable,
	FramePalette
} from "./renderers/tables";
import { getScanlineType } from "./constants";
import constants from "../constants";
import { MemoryChunk } from "../memory";
import { WithContext } from "../helpers";

/** The Picture Processing Unit. It generates a video signal of 256x240 pixels. */
export default class PPU {
	constructor() {
		WithContext.apply(this);

		this.frame = 0;
		this.scanline = 0;
		this.cycle = 0;

		this.memory = new PPUMemoryMap();
		this.oamRam = null; // OAM = Object Attribute Memory (contains sprite data)
		this.registers = null;

		this.frameBuffer = new Uint32Array(constants.TOTAL_PIXELS);
		this.nameTable = new NameTable();
		this.attributeTable = new AttributeTable();
		this.patternTable = new PatternTable();
		this.framePalette = new FramePalette();
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.oamRam = new MemoryChunk(constants.PPU_OAM_SIZE);
		this.registers = new PPURegisterSegment(context);

		this.nameTable.loadContext(context);
		this.attributeTable.loadContext(context);
		this.patternTable.loadContext(context);
		this.framePalette.loadContext(context);

		this._reset();
	}

	/** Executes the next operation. */
	step() {
		this.requireContext();

		const scanlineType = getScanlineType(this.scanline);
		const interrupt = renderers[scanlineType](this.context);

		this._incrementCounters();

		return interrupt;
	}

	/** Draws a pixel in (`x`, `y`) using `color`. */
	plot(x, y, color) {
		this.frameBuffer[y * constants.SCREEN_WIDTH + x] = color;
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();

		this.memory.unloadContext();
		this.oamRam = null;
		this.registers = null;

		this.nameTable.unloadContext();
		this.attributeTable.unloadContext();
		this.patternTable.unloadContext();
		this.framePalette.unloadContext();
	}

	_incrementCounters() {
		this.cycle++;
		if (this.cycle > constants.PPU_LAST_CYCLE) {
			this.cycle = 0;
			this.scanline++;

			if (this.scanline > constants.PPU_LAST_SCANLINE) {
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

	// TODO: REMOVE IF UNUSED
	get _isRenderingEnabled() {
		return (
			this.registers.ppuMask.showBackground ||
			this.registers.ppuMask.showSprites
		);
	}
}
