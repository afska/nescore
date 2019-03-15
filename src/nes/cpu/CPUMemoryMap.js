import { WithComposedMemory, MemoryChunk, MemoryMirror } from "../memory";
import { WithContext } from "../helpers";

/** The CPU memory map. Addess space size: 64KB. */
export default class CPUMemoryMap {
	constructor() {
		WithContext.apply(this);
		WithComposedMemory.apply(this);
	}

	/** When a context is loaded. */
	onLoad({ mapper }) {
		const ram = new MemoryChunk(0x0800);
		const ramMirror = new MemoryMirror(ram, 0x1800);
		const ppuRegisters = new MemoryChunk(0x0008);
		const ppuRegistersMirror = new MemoryMirror(ppuRegisters, 0x1ff8);
		const apuAndIoRegisters = new MemoryChunk(0x0018);
		const cpuTestModeRegisters = new MemoryChunk(0x0008);

		this.defineChunks([
			//                       Address range  Size     Device
			ram, //                  $0000-$07FF    $0800    2KB internal RAM
			ramMirror, //            $0800-$1FFF    $1800    Mirrors of $0000-$07FF
			ppuRegisters, //         $2000-$2007    $0008    NES PPU registers
			ppuRegistersMirror, //   $2008-$3FFF    $1FF8	   Mirrors of $2000-2007 (repeats every 8 bytes)
			apuAndIoRegisters, //    $4000-$4017    $0018	   NES APU and I/O registers
			cpuTestModeRegisters, // $4018-$401F    $0008	   APU and I/O functionality that is normally disabled
			mapper //                $4020-$FFFF    $BFE0	   Cartridge space: PRG ROM, PRG RAM, and mapper registers
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
