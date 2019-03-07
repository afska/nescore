import CPU from "../CPU";
import { MemoryMap, MemoryChunk } from "../memory";

const KB = 1024;

export default (initializeMemory = () => {}) => {
	const cpu = new CPU();
	const memory = new MemoryChunk(64 * KB);
	const context = { cpu, memory };

	initializeMemory(memory);
	cpu.loadContext(context);
	context.context = context;

	return context;
};
