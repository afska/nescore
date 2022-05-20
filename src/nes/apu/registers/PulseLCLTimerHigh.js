import { WriteOnlyInMemoryRegister } from "../../registers";

export default class PulseLCLTimerHigh extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addField("timerHigh", 0, 3).addField("lengthCounterLoad", 4, 5);
	}
}
