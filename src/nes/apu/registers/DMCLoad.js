import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the output sample of the DMC channel directly. */
export default class DMCLoad extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("directLoad", 0, 7);
	}

	/** Writes the DMC Direct Load sample if the channel is active. */
	writeAt(__, byte) {
		this.setValue(byte);

		const { apu } = this.context;
		apu.channels.dmc.directLoadSample = this.directLoad;
	}
}
