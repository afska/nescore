import { WriteOnlyInMemoryRegister } from "../../registers";

/**
 * OAM Address Register (> write)
 *
 * Write the address of OAM you want to access here, then write in `OAMData`.
 * Most games just write $00 here and then use `OAMDMA`.
 */
export default class OAMAddr extends WriteOnlyInMemoryRegister {}
