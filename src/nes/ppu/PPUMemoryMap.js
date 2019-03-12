import { WithComposedMemory, MemoryChunk, MemoryMirror } from "../memory";
import { WithContext } from "../helpers";

/** The CPU memory map. Addess space size: 16KB. */
export default class PPUMemoryMap {
	constructor() {
		WithContext.apply(this);
		WithComposedMemory.apply(this);
	}

	/** When a context is loaded. */
	onLoad() {
		const patternTables = new MemoryChunk(0x2000);
		const nametables = new MemoryChunk(0x1000);
		const nametablesMirror = new MemoryMirror(this, 0x0f00, 0x3000);
		const paletteRam = new MemoryChunk(0x0020);
		const paletteRamMirror = new MemoryMirror(paletteRam, 0x00e0);

		this.defineChunks([
			//                   Address range  Size     Device
			patternTables, //    $0000-$1FFF    $2000    Pattern tables 0 and 1 (mapper)
			nametables, //       $2000-$2FFF    $1800    Nametables 0 to 3 (VRAM and mapper)
			nametablesMirror, // $3000-$3EFF    $0F00    Mirrors of $2000-$2EFF
			paletteRam, //       $3F00-$3F1F    $0020    Palette RAM indexes
			paletteRamMirror //  $3F20-$3FFF    $00E0    Mirrors of $3F00-$3F1F
		]);
	}

	/** Reads a `byte` from `address`, delegating to the mapper. */
	readAt(address) {
		this.context.mapper.mapPpuReadAt(this, address);
	}

	/** Writes a `byte` to `address`, delegating to the mapper. */
	writeAt(address, byte) {
		this.context.mapper.mapPpuReadAt(this, address);
	}

	/** When the current context is unloaded. */
	onUnload() {
		this.defineChunks(null);
	}
}
