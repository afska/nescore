import MemoryChunk from "./MemoryChunk";

const KB = 1024;
const TOTAL_MEMORY = 2 * KB;
const START_ADDRESS = 0x0000;

/** The internal 2 KiB RAM memory. */
export default class RAM extends MemoryChunk {
	constructor() {
		super(TOTAL_MEMORY, START_ADDRESS);
	}
}
