import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the sample address of the DMC channel when using DPCM mode. */
export default class DMCSampleAddress extends WriteOnlyInMemoryRegister {
	/** Returns the absolute address of the sample. */
	get absoluteSampleAddress() {
		// sample address = %11AAAAAA.AA000000 = $C000 + (A * 64)
		return 0xc000 + this.value * 64;
	}
}
