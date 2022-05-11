import { PPURegisterSegment, LoopyRegister } from "./registers";
import PPUMemoryMap from "./PPUMemoryMap";
import renderers from "./renderers";
import {
	NameTable,
	AttributeTable,
	PatternTable,
	FramePalette,
	OAM
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
		this.oamRam = null;
		this.registers = null;
		this.loopy = null;
		this.sprite0HitPixels = null;

		this.frameBuffer = new Uint32Array(constants.TOTAL_PIXELS);
		this.paletteIndexes = new Uint8Array(constants.TOTAL_PIXELS);
		this.nameTable = new NameTable();
		this.attributeTable = new AttributeTable();
		this.patternTable = new PatternTable();
		this.framePalette = new FramePalette();
		this.oam = new OAM();
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.oamRam = new MemoryChunk(constants.PPU_OAM_SIZE);
		this.registers = new PPURegisterSegment(context);
		this.loopy = new LoopyRegister();
		this.sprite0HitPixels = [];

		this.nameTable.loadContext(context);
		this.attributeTable.loadContext(context);
		this.patternTable.loadContext(context);
		this.framePalette.loadContext(context);
		this.oam.loadContext(context);

		this._reset();
	}

	/** Executes the next operation. */
	step() {
		const scanlineType = getScanlineType(this.scanline);
		const interrupt = renderers[scanlineType](this.context);

		this._incrementCounters();

		return interrupt;
	}

	/** Draws a pixel in (`x`, `y`) using BGR `color`. */
	plot(x, y, color) {
		this.frameBuffer[
			y * constants.SCREEN_WIDTH + x
		] = this.registers.ppuMask.transform(color);
	}

	/** Saves the `paletteIndex` of (`x`, `y`). */
	savePaletteIndex(x, y, paletteIndex) {
		this.paletteIndexes[y * constants.SCREEN_WIDTH + x] = paletteIndex;
	}

	/** Returns the palette index of pixel (`x`, `y`). Used for sprite drawing. */
	paletteIndexOf(x, y) {
		return this.paletteIndexes[y * constants.SCREEN_WIDTH + x];
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

		for (let i = 0; i < this.frameBuffer.length - 1; i++) {
			this.frameBuffer[i] = 0;
			this.paletteIndexes[i] = 0;
		}
	}
}
