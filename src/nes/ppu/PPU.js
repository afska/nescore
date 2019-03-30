import { WithContext } from "../helpers";
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
import PatternTable from "./PatternTable";
import _ from "lodash";

const INITIAL_PPUSTATUS = 0b10000000;
const PRIMARY_OAM_SIZE = 256;
const SECONDARY_OAM_SIZE = 32;
const LAST_CYCLE = 340;
const LAST_SCANLINE = 261;

/** The Picture Processing Unit. It generates a video signal of 256x240 pixels. */
export default class PPU {
	constructor() {
		WithContext.apply(this);

		this.frame = 0;
		this.scanline = 0;
		this.cycle = 0;

		this.memory = new PPUMemoryMap();
		this.patternTable = new PatternTable();
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

		this.tile = 0; // TODO: Remove this
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.patternTable.loadContext(context);
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

		// this.context.display.clear();
		this.patternTable.renderTile(
			this.tile,
			((this.tile % 16) * 8) % 32,
			Math.floor((this.tile % 16) / 4) * 8
		);
		this.tile++;
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.patternTable.unloadContext();
		this.memory.unloadContext();
		this.oamRam = null;
		this.oamRam2 = null;
		_.each(this.registers, (register) => register.unloadContext());
	}

	_renderPixel() {
		// const x = this.cycle - 1;
		// const y = this.scanline;
		// const backgroundVisible = !!this.registers.ppuMask.showBackground;
		// const spritesVisible = !!this.registers.ppuMask.showSprites;
	}

	_updateCounters() {
		// cycle:      [0 ... LAST_CYCLE]
		// scanline:   [0 ... LAST_SCANLINE]

		this.cycle++;

		if (this.cycle > LAST_CYCLE) {
			this.cycle = 0;
			this.scanline++;

			if (this.scanline > LAST_SCANLINE) {
				this.scanline = 0;
				this.frame++;
			}
		}
	}

	_reset() {
		this.frame = 0;
		this.scanline = 0;
		this.cycle = 0;
		this.registers.ppuStatus.value = INITIAL_PPUSTATUS;
	}
}
