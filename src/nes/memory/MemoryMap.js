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

	/** When the current context is unloaded. */
	onUnload() {
		this.defineChunks(null);
	}
}
