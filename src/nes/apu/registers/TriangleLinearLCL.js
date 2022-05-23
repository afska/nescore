import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the linear length counter (value and halt flag) of the Triangle channel. */
export default class TriangleLinearLCL extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("lengthCounterLoad", 0, 7).addReadOnlyField(
			"halt",
			7,
			1
		);
	}

	/** Updates the linear length counter. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.channels.triangle.linearLengthCounter.counter = this.lengthCounterLoad;
	}
}
