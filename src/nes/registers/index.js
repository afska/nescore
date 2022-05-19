import InMemoryRegister from "./InMemoryRegister";
import MixedInMemoryRegister from "./MixedInMemoryRegister";

/** A write-only `InMemoryRegister`. */
class WriteOnlyInMemoryRegister extends InMemoryRegister {
	/** Reads nothing (write-only address). */
	readAt() {
		return 0;
	}
}

export { InMemoryRegister, WriteOnlyInMemoryRegister, MixedInMemoryRegister };
