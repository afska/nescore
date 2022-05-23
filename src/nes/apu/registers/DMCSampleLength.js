import { WriteOnlyInMemoryRegister } from "../../registers";

/** Controls the sample length of the DMC channel. */
export default class DMCSampleLength extends WriteOnlyInMemoryRegister {
	/** Returns the real sample length. */
	get realSampleLength() {
		// sample length = %LLLL.LLLL0001 = (L * 16) + 1 bytes
		return this.value * 16 + 1;
	}
}
