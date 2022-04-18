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
import { cycleType, scanlineType } from "./constants";
import { interrupts } from "../cpu/constants";
import PPUMemoryMap from "./PPUMemoryMap";

const INITIAL_PPUSTATUS = 0b10000000;
const REGISTER_SEGMENT_SIZE = 8;
const PRIMARY_OAM_SIZE = 256;
const SECONDARY_OAM_SIZE = 32;
const LAST_CYCLE = 340;
const LAST_SCANLINE = 261;
const SPRITES_PER_SCANLINE = 8;

/** The Picture Processing Unit. It generates a video signal of 256x240 pixels. */
export default class PPU {
	constructor() {
		WithContext.apply(this);

		this.frame = 0;
		this.scanline = 0;
		this.cycle = 0;

		this.memory = new PPUMemoryMap();
		this.registersRam = null; // 8-byte segment with `registers` (mapped to CPU)
		this.oamRam = null; // OAM = Object Attribute Memory (contains sprite data)
		this.oamRam2 = null;
		this.registers = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.registersRam = new MemoryChunk(REGISTER_SEGMENT_SIZE);
		this.oamRam = new MemoryChunk(PRIMARY_OAM_SIZE);
		this.oamRam2 = new MemoryChunk(SECONDARY_OAM_SIZE);
		this.registers = {
			ppuCtrl: new PPUCtrl(this.context.memory, 0x2000),
			ppuMask: new PPUMask(this.context.memory, 0x2001),
			ppuStatus: new PPUStatus(this.context.memory, 0x2002),
			oamAddr: new OAMAddr(this.context.memory, 0x2003),
			oamData: new OAMData(this.context.memory, 0x2004),
			ppuScroll: new PPUScroll(this.context.memory, 0x2005),
			ppuAddr: new PPUAddr(this.context.memory, 0x2006),
			ppuData: new PPUData(this.context.memory, 0x2007),
			oamDma: new OAMDMA(this.context.memory, 0x4014)
		};
		this._reset();
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.memory.unloadContext();
		this.registersRam = null;
		this.oamRam = null;
		this.oamRam2 = null;
		this.registers = null;
	}

	_reset() {
		this.frame = 0;
		this.scanline = LAST_SCANLINE;
		this.cycle = 0;

		this.registers.ppuStatus.value = INITIAL_PPUSTATUS;
	}

	get _isRenderingEnabled() {
		return (
			this.registers.ppuMask.showBackground ||
			this.registers.ppuMask.showSprites
		);
	}
}
