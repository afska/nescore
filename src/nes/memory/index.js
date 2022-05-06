import WithCompositeMemory from "./WithCompositeMemory";
import MemoryChunk from "./MemoryChunk";
import MemoryMirror from "./MemoryMirror";
import MemoryPadding from "./MemoryPadding";
import RewiredMemoryChunk from "./RewiredMemoryChunk";

/**
 * A memory segment should have:
 * - `readAt(address)`: read 1 byte
 * - `writeAt(address, byte)`: write 1 byte
 *
 * Top level segments also require:
 * - `read2BytesAt(address)`: read 2 bytes in Little Endian
 * - `write2BytesAt(address, value)`: writes 2 bytes in Little Endian
 * - `readBytesAt(address, length)`: read 1 or 2 bytes
 *
 * For mirroring or composite memory usage, define:
 * - `memorySize`: how many bytes it contains
 */

export {
	WithCompositeMemory,
	MemoryChunk,
	MemoryMirror,
	MemoryPadding,
	RewiredMemoryChunk
};
