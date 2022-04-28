import PPUCtrl from "./PPUCtrl";
import PPUMask from "./PPUMask";
import PPUStatus from "./PPUStatus";
import OAMAddr from "./OAMAddr";
import OAMData from "./OAMData";
import PPUScroll from "./PPUScroll";
import PPUAddr from "./PPUAddr";
import PPUData from "./PPUData";
import OAMDMA from "./OAMDMA";
import { WithCompositeMemory } from "../../memory";

/** Represents all the CPU-mapped PPU registers. */
class PPURegisterSegment {
	constructor(context) {
		this.ppuCtrl = new PPUCtrl().loadContext(context);
		this.ppuMask = new PPUMask().loadContext(context);
		this.ppuStatus = new PPUStatus().loadContext(context);
		this.oamAddr = new OAMAddr().loadContext(context);
		this.oamData = new OAMData().loadContext(context);
		this.ppuScroll = new PPUScroll().loadContext(context);
		this.ppuAddr = new PPUAddr().loadContext(context);
		this.ppuData = new PPUData().loadContext(context);
		this.oamDma = new OAMDMA().loadContext(context);
	}

	/** Creates a memory segment with the first 8 registers ($2000-$2007). */
	toMemory() {
		return WithCompositeMemory.createSegment([
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
