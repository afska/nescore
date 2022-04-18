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
import _ from "lodash";

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

		/**
		 *  0x2000 PPUCtrl
				0x2001 PPUMask
				0x2002 PPUStatus
				0x2003 OAMAddr
				0x2004 OAMData
				0x2005 PPUScroll
				0x2006 PPUAddr
				0x2007 PPUData
				0x4014 OAMDMA
		 */
		this.registers = {
			ppuCtrl: new PPUCtrl(), // TODO: Pass memory segment and relative addresses
			ppuMask: new PPUMask(),
			ppuStatus: new PPUStatus(),
			oamAddr: new OAMAddr(),
			oamData: new OAMData(),
			ppuScroll: new PPUScroll(),
			ppuAddr: new PPUAddr(),
			ppuData: new PPUData(),
			oamDma: new OAMDMA()
		};
	}

	/** When a context is loaded. */
	onLoad(context) {
		this.memory.loadContext(context);
		this.registersRam = new MemoryChunk(REGISTER_SEGMENT_SIZE);
		this.oamRam = new MemoryChunk(PRIMARY_OAM_SIZE);
		this.oamRam2 = new MemoryChunk(SECONDARY_OAM_SIZE);
		_.each(this.registers, (register) => register.loadContext(context.memory));
		this._reset();
	}

	/** When the current context is unloaded. */
	onUnload() {
		this._reset();
		this.memory.unloadContext();
		this.registersRam = null;
		this.oamRam = null;
		this.oamRam2 = null;
		_.each(this.registers, (register) => register.unloadContext());
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
