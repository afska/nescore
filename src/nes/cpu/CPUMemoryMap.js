import {
	WithCompositeMemory,
	MemoryChunk,
	MemoryMirror,
	MemoryPadding
} from "../memory";
import { MixedInMemoryRegister } from "../registers";
import { WithContext } from "../helpers";

/** The CPU memory map. Addess space size: 64KB. */
export default class CPUMemoryMap {
	constructor() {
		WithContext.apply(this);
		WithCompositeMemory.apply(this);
	}

	/** When a context is loaded. */
	onLoad({ ppu, apu, mapper, controllers }) {
		this.ram = new MemoryChunk(0x0800);
		const ramMirror = new MemoryMirror(this.ram, 0x1800);
		const ppuRegisters = ppu.registers.toMemory();
		const ppuRegistersMirror = new MemoryMirror(ppuRegisters, 0x1ff8);
		const apuRegisters = apu.registers.toMemory();
		const port2AndFrameCounter = new MixedInMemoryRegister(
			controllers[1].port,
			apu.registers.apuFrameCounter
		);
		const cpuTestModeRegisters = new MemoryPadding(0x0008);

		this.defineChunks([
			//                        Address range  Size     Device
			this.ram, //              $0000-$07FF    $0800    2KB internal RAM
			ramMirror, //             $0800-$1FFF    $1800    Mirrors of $0000-$07FF
			ppuRegisters, //          $2000-$2007    $0008    NES PPU registers
			ppuRegistersMirror, //    $2008-$3FFF    $1FF8    Mirrors of $2000-$2007 (repeats every 8 bytes)
			apuRegisters, //          $4000-$4013    $0014    NES APU registers
			ppu.registers.oamDma, //  $4014-$4014    $0001    PPU's OAM DMA register
			apu.registers.apuMain, // $4015-$4015    $0001    APU status/control register
			controllers[0].port, //   $4016-$4016    $0001    Controller port 1
			port2AndFrameCounter, //  $4017-$4017    $0001    Controller port 2 and APU frame counter
			cpuTestModeRegisters, //  $4018-$401F    $0008    APU and I/O functionality that is normally disabled
			mapper.segments.cpu //    $4020-$FFFF    $BFE0    Cartridge space: PRG ROM, PRG RAM, and mapper registers
		]);
	}

	/** Reads a `byte` from `address`, which can be a register or a memory address. */
	readAt(address) {
		return address.value != null
			? address.value
			: WithCompositeMemory.readAt.call(this, address);
	}

	/** Writes a `byte` to `address`, which can be a register or a memory address. */
	writeAt(address, byte) {
		if (address.value != null) address.value = byte;
		else WithCompositeMemory.writeAt.call(this, address, byte);
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		const { ppu, apu } = this.context;

		return {
			ram: Array.from(this.ram.bytes),
			ppuRegisters: ppu.registers.toMemory().chunks.map((it) => it.value),
			apuRegisters: apu.registers.toMemory().chunks.map((it) => it.value),
			apuControl: apu.registers.apuControl.value,
			apuFrameCounter: apu.registers.apuFrameCounter.value
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		const { ppu, apu } = this.context;

		this.ram.bytes.set(saveState.ram);
		ppu.registers.toMemory().chunks.forEach((chunk, i) => {
			chunk.setValue && chunk.setValue(saveState.ppuRegisters[i]);
		});
		apu.registers.toMemory().chunks.forEach((chunk, i) => {
			chunk.setValue && chunk.setValue(saveState.apuRegisters[i]);
		});
		apu.registers.apuControl.setValue(saveState.apuControl);
		apu.registers.apuFrameCounter.setValue(saveState.apuFrameCounter);
	}
}
