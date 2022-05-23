import { WriteOnlyInMemoryRegister } from "../../registers";

// TODO:?
export default class APUFrameCounter extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("interruptInhibitFlag", 6).addReadOnlyField(
			"sequencerMode",
			7
		);
	}
}
