import WithMemory from "./WithMemory";
import { Buffer } from "buffer";
import _ from "lodash";

/**
 * A memory chunk that can store `bytes`.
 * It's located at the `startAddress` of another memory structure.
 */
export default class MemoryChunk {
	constructor(bytes) {
		if (_.isFinite(bytes)) bytes = Buffer.alloc(bytes);
		WithMemory.apply(this);

		this.bytes = bytes;
		this.memorySize = bytes.length;
	}

	/** Returns the memory bytes. */
	getMemory() {
		return this.bytes;
	}
}
