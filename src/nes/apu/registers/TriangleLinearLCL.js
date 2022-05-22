import { WriteOnlyInMemoryRegister } from "../../registers";

export default class TriangleLinearLCL extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("lengthCounterLoad", 0, 7).addReadOnlyField(
			"halt",
			7,
			1
		);
	}

	// /** TODO. */
	writeAt(__, byte) {
		this.setValue(byte);

		this.context.apu.channels.triangle.linearLengthCounter.counter = this.lengthCounterLoad;
	}
}
