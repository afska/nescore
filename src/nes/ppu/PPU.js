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
		this.oamRam = null; // OAM = Object Attribute Memory (contains sprite data)
		this.oamRam2 = null;
		this.registers = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		const cpuMemory = context.memory;

		this.memory.loadContext(context);
		this.oamRam = new MemoryChunk(PRIMARY_OAM_SIZE);
		this.oamRam2 = new MemoryChunk(SECONDARY_OAM_SIZE);
		this.registers = {
			ppuCtrl: new PPUCtrl(cpuMemory, 0x2000),
			ppuMask: new PPUMask(cpuMemory, 0x2001),
			ppuStatus: new PPUStatus(cpuMemory, 0x2002),
			oamAddr: new OAMAddr(cpuMemory, 0x2003),
			oamData: new OAMData(cpuMemory, 0x2004),
			ppuScroll: new PPUScroll(cpuMemory, 0x2005),
			ppuAddr: new PPUAddr(cpuMemory, 0x2006),
			ppuData: new PPUData(cpuMemory, 0x2007),
			oamDma: new OAMDMA(cpuMemory, 0x4014)
		};
		this._reset();
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.memory.unloadContext();
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
