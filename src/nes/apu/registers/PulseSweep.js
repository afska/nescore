import { WriteOnlyInMemoryRegister } from "../../registers";

export default class PulseSweep extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("shiftCount", 0, 3)
			.addReadOnlyField("negateFlag", 3)
			.addReadOnlyField("dividerPeriodMinusOne", 4, 3)
			.addReadOnlyField("enabledFlag", 7);
	}
}
