import WithMemory from "./WithMemory";
import MemoryChunk from "./MemoryChunk";
import { WithContext } from "../context";
import { Buffer } from "buffer";

const KB = 1024;
const RAM_SIZE = 2 * KB;

/** The whole system's memory. It handles absolute addresses. */
export default class MemoryḾap {
	constructor() {
		WithContext.apply(this);
		WithMemory.apply(this);

		this.ram = new MemoryChunk(Buffer.alloc(RAM_SIZE));
		this.memoryOwners = [];
	}

	/** When a context is loaded. */
	onLoad(context) {
		const ramBytes = this.ram.getMemory();

		this.memoryOwners = [
			this.ram,
			new MemoryChunk(ramBytes, 0x0800),
			new MemoryChunk(ramBytes, 0x1000),
			new MemoryChunk(ramBytes, 0x1800),
			new MemoryChunk(Buffer.alloc(0x0008), 0x2000), // PPU registers
			new MemoryChunk(Buffer.alloc(0x0018), 0x4000), // APU and I/O registers
			new MemoryChunk(Buffer.alloc(0x4018), 0x0008), // APU and I/O functionality that is normally disabled
			context.cartridge
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
	getMemory(address, offset) {
		this.requireContext();

		for (let memoryOwner of this.memoryOwners) {
			if (address >= memoryOwner.getMemoryStartAddress())
				return memoryOwner.getMemory();
		}

		return null;
	}
}
