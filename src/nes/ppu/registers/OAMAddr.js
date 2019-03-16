import { InMemoryRegister } from "../../registers";

/**
 * OAM Address Port
 *
 * Write the address of OAM you want to access here.
 * Most games just write $00 here and then use `OAMDMA`.
 */

export default class OAMAddr extends InMemoryRegister {
	constructor() {
		super(0x2003);
	}
}
