import MemoryChunk from "./MemoryChunk";
import { WithContext } from "../helpers";
import { Buffer } from "buffer";

const KB = 1024;
const RAM_SIZE = 2 * KB;

/** The whole system's memory. It handles absolute addresses. */
export default class MemoryḾap {
	constructor() {
		WithContext.apply(this);

		this.ram = new MemoryChunk(Buffer.alloc(RAM_SIZE));
		this.chunks = null;
	}

	/** When a context is loaded. */
	onLoad(context) {
		const ramBytes = this.ram.getMemory();

		this.chunks = [
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
		this.chunks = null;
	}

	/** Reads a byte from `address`, using the correct `chunk`. */
	readAt(address) {
		this.requireContext();

		const chunk = this._getChunkFor(address);
		const offset = this._toRelativeAddress(address, chunk);
		return chunk.readAt(offset);
	}

	/** Writes a `byte` to `address`, using the correct `chunk`. */
	writeAt(address, byte) {
		this.requireContext();

		const chunk = this._getChunkFor(address);
		const offset = this._toRelativeAddress(address, chunk);
		return chunk.writeAt(offset, byte);
	}

	_getChunkFor(address) {
		this.requireContext();

		for (let chunk of this.chunks) {
			const { startAddress } = chunk;

			if (address >= startAddress && address < startAddress + chunk.size)
				return chunk;
		}

		throw new Error(`Unreachable address: 0x${address.toString(16)}.`);
	}

	_toRelativeAddress(address, chunk) {
		return address - chunk.startAddress;
	}
}
