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
	/** Reads a byte from `address`, using the mapper. */
	readAt(address) {
		return this.mapper.cpuReadAt(address);
	}

	/** Writes a `byte` to `address`, using the mapper. */
	writeAt(address, byte) {
		return this.mapper.cpuWriteAt(address, byte);
	}
}

/** The PPU bus. */
class PPUBus extends Bus {
	/** Reads a byte from `address`, using the mapper. */
	readAt(address) {
		return this.mapper.ppuReadAt(address);
	}

	/** Writes a `byte` to `address`, using the mapper. */
	writeAt(address, byte) {
		return this.mapper.ppuWriteAt(address, byte);
	}
}

export { CPUBus, PPUBus };
