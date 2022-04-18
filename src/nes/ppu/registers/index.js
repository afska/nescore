import PPUCtrl from "./PPUCtrl";
import PPUMask from "./PPUMask";
import PPUStatus from "./PPUStatus";
import OAMAddr from "./OAMAddr";
import OAMData from "./OAMData";
import PPUScroll from "./PPUScroll";
import PPUAddr from "./PPUAddr";
import PPUData from "./PPUData";
import OAMDMA from "./OAMDMA";
import { WithComposedMemory } from "../../memory";

/** Represents all the CPU-mapped PPU registers. */
class PPURegisterSegment {
	constructor() {
		this.ppuCtrl = new PPUCtrl();
		this.ppuMask = new PPUMask();
		this.ppuStatus = new PPUStatus();
		this.oamAddr = new OAMAddr();
		this.oamData = new OAMData();
		this.ppuScroll = new PPUScroll();
		this.ppuAddr = new PPUAddr();
		this.ppuData = new PPUData();
		this.oamDma = new OAMDMA();
	}

	/** Creates a memory segment with the first 8 registers ($2000-$2007). */
	toMemory() {
		return WithComposedMemory.createSegment([
			this.ppuCtrl,
			this.ppuMask,
			this.ppuStatus,
			this.oamAddr,
			this.oamData,
			this.ppuScroll,
			this.ppuAddr,
			this.ppuData
		]);
	}
}

export {
	PPUCtrl,
	PPUMask,
	PPUStatus,
	OAMAddr,
	OAMData,
	PPUScroll,
	PPUAddr,
	PPUData,
	OAMDMA,
	PPURegisterSegment
};
