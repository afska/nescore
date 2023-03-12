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
import constants from "../constants";
import { WithContext } from "../helpers";

const FULL_ALPHA = 0xff000000;

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

		this.nameTable = new NameTable();
		this.attributeTable = new AttributeTable();
		this.patternTable = new PatternTable();
		this.framePalette = new FramePalette();
		this.oam = new OAM();

		this.frameBuffer = new Uint32Array(constants.TOTAL_PIXELS);
		this.paletteIndexes = new Uint8Array(constants.TOTAL_PIXELS);
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.oamRam = new Uint8Array(constants.PPU_OAM_SIZE);
		this.registers = new PPURegisterSegment(context);
		this.loopy = new LoopyRegister();

		this.nameTable.loadContext(context);
		this.attributeTable.loadContext(context);
		this.patternTable.loadContext(context);
		this.framePalette.loadContext(context);
		this.oam.loadContext(context);

		this._reset();
	}

	/**
	 * Executes a number of `cycles`.
	 * It calls `onFrame` when it generates a new frame.
	 * It calls `onIntr` on interrupts;
	 */
	step(cycles, onFrame, onIntr) {
		for (let i = 0; i < cycles; i++) {
			// <optimization>
			if (this.cycle > 1 && this.cycle < 256) {
				i += this._skip(256, cycles, i);
				continue;
			} else if (this.cycle > 260 && this.cycle < 304) {
				i += this._skip(304, cycles, i);
				continue;
			} else if (this.cycle > 304 && this.cycle < 340) {
				i += this._skip(340, cycles, i);
				continue;
			}
			// </optimization>

			const scanlineType = getScanlineType(this.scanline);
			const interrupt = renderers[scanlineType](this.context);
			if (interrupt) onIntr(interrupt);
			this._incrementCounters(onFrame);
		}
	}

	/** Draws a pixel (ABGR) in (`x`, `y`) using BGR `color`. */
	plot(x, y, color) {
		this.frameBuffer[y * constants.SCREEN_WIDTH + x] =
			FULL_ALPHA | this.registers.ppuMask.transform(color);
	}

	/** Returns the palette index of pixel (`x`, `y`). Used for sprite drawing. */
	paletteIndexOf(x, y) {
		return this.paletteIndexes[y * constants.SCREEN_WIDTH + x];
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			frame: this.frame,
			scanline: this.scanline,
			cycle: this.cycle,
			memory: this.memory.getSaveState(),
			oamRam: Array.from(this.oamRam),
			loopy: this.loopy.getSaveState()
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.frame = saveState.frame;
		this.scanline = saveState.scanline;
		this.cycle = saveState.scanline;
		this.memory.setSaveState(saveState.memory);
		this.oamRam = new Uint8Array(saveState.oamRam);
		this.loopy.setSaveState(saveState.loopy);
	}

	_skip(destinationCycle, cycles, i) {
		const skippedCycles = Math.min(destinationCycle - this.cycle, cycles - i);
		this.cycle += skippedCycles;
		return skippedCycles - 1;
	}

	_incrementCounters(onFrame) {
		this.cycle++;
		if (this.cycle > constants.PPU_LAST_CYCLE) {
			this.cycle = 0;
			this.scanline++;

			if (this.scanline > constants.PPU_LAST_SCANLINE) {
				this.scanline = -1;
				this.frame++;
				onFrame(this.frameBuffer);
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

/** Returns the type of `scanLine`. */
function getScanlineType(scanLine) {
	if (scanLine === -1) {
		return "PRELINE";
	} else if (scanLine < 240) {
		return "VISIBLE";
	} else if (scanLine === 241) {
		return "VBLANK_START";
	} else {
		return "IDLE";
	}
}
