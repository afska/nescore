import WithMemory from "./WithMemory";
import { WithContext } from "../context";
import MemoryChunk from "./WithMemory";

/** The whole system's memory. It handles absolute addresses. */
export default class MemoryḾap {
	constructor() {
		WithContext.apply(this);
		WithMemory.apply(this);

		this.memoryOwners = [];
	}

	/** When a context is loaded. */
	onLoad(context) {
		const ramBytes = context.ram.getMemory();

		this.memoryOwners = [
			context.ram,
			new MemoryChunk(ramBytes, 0x0800),
			new MemoryChunk(ramBytes, 0x1000),
			new MemoryChunk(ramBytes, 0x1800)
			// TODO: Add PPU
		];
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.memoryOwners = [];
	}

	/** Returns the starting memory address. */
	getMemoryStartAddress() {
		return 0x0000;
	}

	/** Returns the memory bytes. */
	getMemory(address) {
		this.requireContext();

		for (let memoryOwner of this.memoryOwners) {
			if (address >= memoryOwner.getMemoryStartAddress())
				return memoryOwner.getMemory();
		}

		return null;
	}
}
