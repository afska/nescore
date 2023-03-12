import WithLittleEndian from "./WithLittleEndian";

/** A memory Bus that forwards every memory access to the cartridge's mapper. */
class Bus {
	constructor(mapper) {
		WithLittleEndian.apply(this);

		this.mapper = mapper;
	}
}

/** The CPU bus. */
class CPUBus extends Bus {
	/** Writes a `byte` to `address`, using the mapper. */
	writeAt(address, byte) {
		this.mapper.cpuWriteAt(address, byte);
	}
}

export { CPUBus };
