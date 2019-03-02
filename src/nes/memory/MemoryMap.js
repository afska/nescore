import WithComposedMemory from "./WithComposedMemory";
import MemoryChunk from "./MemoryChunk";
import MemoryMirror from "./MemoryMirror";
import { WithContext } from "../helpers";
import { Buffer } from "buffer";

const KB = 1024;
const RAM_SIZE = 2 * KB;

/** The whole system's memory. It handles absolute addresses. */
export default class MemoryMap {
	constructor() {
		WithContext.apply(this);
		WithComposedMemory.apply(this);
	}

	/** When a context is loaded. */
	onLoad({ cartridge }) {
		const ram = new MemoryChunk(Buffer.alloc(RAM_SIZE));
		const ramMirror = new MemoryMirror(ram, 0x0800, 0x1800);
		const ppuRegisters = new MemoryChunk(Buffer.alloc(0x0008), 0x2000);
		const ppuRegistersMirror = new MemoryMirror(ppuRegisters, 0x2008, 0x1ff8);
		const apuAndIORegisters = new MemoryChunk(Buffer.alloc(0x0018), 0x4000);
		const cpuTestModeRegisters = new MemoryChunk(Buffer.alloc(0x0008), 0x4018);

		this.defineChunks([
			ram,
			ramMirror,
			ppuRegisters,
			ppuRegistersMirror,
			apuAndIORegisters,
			cpuTestModeRegisters,
			cartridge
		]);
	}

	/** Reads a `byte` from `address`, which can be a register or a memory address. */
	readAt(address) {
		return address.value
			? address.value
			: WithComposedMemory.readAt.call(this, address);
	}

	/** Writes a `byte` to `address`, which can be a register or a memory address. */
	writeAt(address, byte) {
		if (address.value) address.value = byte;
		else WithComposedMemory.writeAt.call(this, address, byte);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.defineChunks(null);
	}
}
