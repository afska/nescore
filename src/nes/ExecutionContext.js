import { MemoryOwner, Memory } from "./memory";
import _ from "lodash";

export default class ExecutionContext {
	constructor(data) {
		MemoryOwner.apply(this);
		_.assign(this, data);

		this.memoryOwners = [
			this.ram,
			new Memory(this.ram.getMemory(), 0x0800, 0x0fff),
			new Memory(this.ram.getMemory(), 0x1000, 0x17ff),
			new Memory(this.ram.getMemory(), 0x1800, 0x1fff)
		];
	}

	getMemoryStartAddress() {
		return 0x0000;
	}

	getMemoryEndAddress() {
		return 0xffff;
	}

	getMemory(address) {
		return this.bytes; // TODO: Implement
	}
}
