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

/** A collection of all the CPU-mapped PPU registers. */
class PPURegisterSegment {
	constructor(context) {
		this.ppuCtrl = new PPUCtrl().loadContext(context); //     $2000
		this.ppuMask = new PPUMask().loadContext(context); //     $2001
		this.ppuStatus = new PPUStatus().loadContext(context); // $2002
		this.oamAddr = new OAMAddr().loadContext(context); //     $2003
		this.oamData = new OAMData().loadContext(context); //     $2004
		this.ppuScroll = new PPUScroll().loadContext(context); // $2005
		this.ppuAddr = new PPUAddr().loadContext(context); //     $2006
		this.ppuData = new PPUData().loadContext(context); //     $2007
		this.oamDma = new OAMDMA().loadContext(context); //       $4014
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
