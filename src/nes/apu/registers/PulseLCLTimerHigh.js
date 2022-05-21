import { WriteOnlyInMemoryRegister } from "../../registers";

export default class PulseLCLTimerHigh extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("timerHigh", 0, 3).addReadOnlyField(
			"lengthCounterLoad",
			4,
			5
		);
	}
}
