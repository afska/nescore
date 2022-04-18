import { InMemoryRegister } from "../../registers";

/**
 * OAM Address Port (> write)
 *
 * Write the address of OAM you want to access here, then write in `OAMData`.
 * Most games just write $00 here and then use `OAMDMA`.
 */
export default class OAMAddr extends InMemoryRegister {
	constructor() {
		super(0x2003);
	}
}
