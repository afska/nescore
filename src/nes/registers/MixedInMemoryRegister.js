/** An 8-bit register in RAM, that behaves differently depending on the access type (read/write). */
export default class MixedInMemoryRegister {
	constructor(readRegister, writeRegister) {
		this.readRegister = readRegister;
		this.writeRegister = writeRegister;
		this.memorySize = 1;
	}

	readAt(address) {
		return this.readRegister.readAt(address);
	}

	writeAt(address, byte) {
		this.writeRegister.writeAt(address, byte);
	}
}
