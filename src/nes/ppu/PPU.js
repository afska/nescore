import { WithContext, Byte } from "../helpers";
import { MemoryChunk } from "../memory";
import {
	PPUCtrl,
	PPUMask,
	PPUStatus,
	OAMAddr,
	OAMData,
	PPUScroll,
	PPUAddr,
	PPUData,
	OAMDMA
} from "./registers";
import PPUMemoryMap from "./PPUMemoryMap";
// import palette from "./palette";
import _ from "lodash";

const INITIAL_PPUSTATUS = 0b10000000;
const PRIMARY_OAM_SIZE = 256;
const SECONDARY_OAM_SIZE = 32;
const LAST_CYCLE = 340;
const LAST_SCANLINE = 261;
const TILE_SIZE_X = 8;
const TILE_SIZE_Y = 8;
const TILE_SIZE_BYTES = 16;

/** The Picture Processing Unit. It generates a video signal of 256x240 pixels. */
export default class PPU {
	constructor() {
		WithContext.apply(this);

		this.frame = 0;
		this.scanLine = 0;
		this.cycle = 0;

		this.memory = new PPUMemoryMap();
		this.oamRam = null; // OAM = Object Attribute Memory (contains sprite data)
		this.oamRam2 = null;

		this.registers = {
			ppuCtrl: new PPUCtrl(),
			ppuMask: new PPUMask(),
			ppuStatus: new PPUStatus(),
			oamAddr: new OAMAddr(),
			oamData: new OAMData(),
			ppuScroll: new PPUScroll(),
			ppuAddr: new PPUAddr(),
			ppuData: new PPUData(),
			oamDma: new OAMDMA()
		};

		// TODO: Initialize
		this.tile = 0;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.oamRam = new MemoryChunk(PRIMARY_OAM_SIZE);
		this.oamRam2 = new MemoryChunk(SECONDARY_OAM_SIZE);
		_.each(this.registers, (register) => register.loadContext(context.memory));
		this._reset();
	}

	/** Executes cycles until reaching `masterCycle`. */
	stepTo(masterCycle) {
		while (this.cycle < masterCycle) this.step();
	}

	/** Executes the next cycle. */
	step() {
		// this._renderPixel();
		// this._shiftRegisters();
		// this._fetch();
		// this._evaluateSprites();
		// this._updateFlags();
		// this._updateScroll();
		// this._updateCounters();

		// The pattern table is an area of memory connected to the PPU that defines the shapes of tiles that make up backgrounds and sprites. Each tile in the pattern table is 16 bytes, made of two planes. The first plane controls bit 0 of the color; the second plane controls bit 1. Any pixel whose color is 0 is background/transparent.

		// render tile
		const firstPlane = this.tile * TILE_SIZE_BYTES;
		const secondPlane = firstPlane + TILE_SIZE_BYTES / 2;

		const pixels = []; // TODO: Avoid allocation
		for (let y = 0; y < TILE_SIZE_Y; y++) {
			const row1 = this.memory.readAt(firstPlane + y);
			const row2 = this.memory.readAt(secondPlane + y);

			for (let x = 0; x < TILE_SIZE_X; x++) {
				const column = TILE_SIZE_X - 1 - x;
				const lsb = Byte.getBit(row1, column);
				const msb = Byte.getBit(row2, column);
				pixels.push(lsb + msb * 2);
			}
		}

		const palette = [0xffffff, 0xcecece, 0x686868, 0x000000];

		pixels.forEach((p, i) => {
			this.context.display.draw(i % 8, Math.floor(i / 8), palette[p]);
		});

		this.tile++;
		// TODO: Do it
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.memory.unloadContext();
		this.oamRam = null;
		this.oamRam2 = null;
		_.each(this.registers, (register) => register.unloadContext());
	}

	_renderPixel() {
		if (this.cycle >= 257 || this.scanLine >= 240 || this.cycle === 0) return;
		// (performance check)

		// const x = this.cycle - 1;
		// const y = this.scanLine;

		// const backgroundVisible = !!this.registers.ppuMask.showBackground;
		// const spritesVisible = !!this.registers.ppuMask.showSprites;
	}

	_updateCounters() {
		// cycle:      [0 ... LAST_CYCLE]
		// scanLine:   [0 ... LAST_SCANLINE]

		this.cycle++;

		if (this.cycle > LAST_CYCLE) {
			this.cycle = 0;
			this.scanLine++;

			if (this.scanLine > LAST_SCANLINE) {
				this.scanLine = 0;
				this.frame++;
			}
		}
	}

	_reset() {
		this.frame = 0;
		this.scanLine = 0;
		this.cycle = 0;
		this.registers.ppuStatus.value = INITIAL_PPUSTATUS;
	}
}
