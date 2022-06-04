import {
	WithCompositeMemory,
	MemoryMirror,
	RewiredMemoryChunk
} from "../memory";
import mirroring from "./mirroring";
import { WithContext } from "../helpers";

/** The PPU memory map. Address space size: 16KB. */
export default class PPUMemoryMap {
	constructor() {
		WithContext.apply(this);
		WithCompositeMemory.apply(this);
	}

	/** When a context is loaded. */
	onLoad({ cartridge, mapper }) {
		// (the system only has memory for two Name tables, the other two are mirrored)
		this.nameTables = new RewiredMemoryChunk(0x1000);
		this.changeNameTablesMirroringTo(cartridge.header.mirroring);
		const nameTablesMirror = new MemoryMirror(this.nameTables, 0x0f00);
		this.paletteRam = new RewiredMemoryChunk(0x20, {
			// ($3F10/$3F14/$3F18/$3F1C are mirrors of $3F00/$3F04/$3F08/$3F0C)
			0x10: 0x00,
			0x14: 0x04,
			0x18: 0x08,
			0x1c: 0x0c
		});
		const paletteRamMirror = new MemoryMirror(this.paletteRam, 0x00e0);

		this.defineChunks([
			//                      Address range  Size     Device
			mapper.segments.ppu, // $0000-$1FFF    $2000    Pattern tables 0 and 1 (mapper)
			this.nameTables, //     $2000-$2FFF    $1000    Name tables 0 to 3 (VRAM + mirror)
			nameTablesMirror, //    $3000-$3EFF    $0F00    Mirrors of $2000-$2EFF
			this.paletteRam, //     $3F00-$3F1F    $0020    Palette RAM indexes
			paletteRamMirror //     $3F20-$3FFF    $00E0    Mirrors of $3F00-$3F1F
		]);
	}

	changeNameTablesMirroringTo(mirroringType) {
		this.nameTables.$mirroringType = mirroringType;
		this.nameTables.mapping = mirroring[mirroringType];
	}

	/** Returns a snapshot of the current state. */
	getSaveState() {
		return {
			nameTables: Array.from(this.nameTables.bytes),
			mirroringType: this.nameTables.$mirroringType,
			paletteRam: Array.from(this.paletteRam.bytes)
		};
	}

	/** Restores state from a snapshot. */
	setSaveState(saveState) {
		this.nameTables.bytes.set(saveState.nameTables);
		this.changeNameTablesMirroringTo(saveState.mirroringType);
		this.paletteRam.bytes.set(saveState.paletteRam);
	}
}
