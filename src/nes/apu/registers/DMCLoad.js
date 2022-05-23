import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the output sample of the DMC channel directly. */
export default class DMCLoad extends WriteOnlyInMemoryRegister {
	constructor() {
		super();

		this.addReadOnlyField("directLoad", 0, 7);
	}
}
