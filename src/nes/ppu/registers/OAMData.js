import { InMemoryRegister } from "../../registers";

/**
 * OAM Data Port (<> read/write)
 *
 * Write OAM data here. Writes will increment `OAMAddr` after the write.
 */

export default class OAMAddr extends InMemoryRegister {
	constructor() {
		super(0x2004);
	}
}
