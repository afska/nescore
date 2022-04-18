import WithMemory from "./WithMemory";
import WithComposedMemory from "./WithComposedMemory";
import MemoryChunk from "./MemoryChunk";
import MemoryMirror from "./MemoryMirror";
import MemoryPadding from "./MemoryPadding";

/**
 * A memory segment should have:
 * - `memorySize`: how many bytes it contains
 * - `readAt(address)`: read 1 byte
 * - `writeAt(address, byte)`: write 1 byte
 * - `read2BytesAt(address)`: read 2 bytes in Little Endian
 * - `write2BytesAt(address, value)`: writes 2 bytes in Little Endian
 * - `readBytesAt(address, length)`: read 1 or 2 bytes
 */

export {
	WithMemory,
	WithComposedMemory,
	MemoryChunk,
	MemoryMirror,
	MemoryPadding
};
