import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the sample length of the DMC channel when using DPCM mode. */
export default class DMCSampleLength extends WriteOnlyInMemoryRegister {
	/** Returns the real sample length in bytes. */
	get lengthInBytes() {
		// sample length = %LLLL.LLLL0001 = (L * 16) + 1 bytes
		return this.value * 16 + 1;
	}
}
