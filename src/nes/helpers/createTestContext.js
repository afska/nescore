import CPU from "../CPU";
import { MemoryMap, MemoryChunk } from "../memory";
import { Buffer } from "buffer";

const KB = 1024;

export default () => {
	const cpu = new CPU();
	const memory = new MemoryChunk(Buffer.alloc(64 * KB));
	const context = { cpu, memory };
	cpu.loadContext(context);
	context.context = context;
	return context;
};
