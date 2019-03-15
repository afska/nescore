import CPU from "../cpu";
import { MemoryChunk } from "../memory";
import { WithContext } from "../helpers";

const KB = 1024;

export default (initializeMemory = () => {}) => {
	const cpu = new CPU();
	const memory = (cpu.memory = new MemoryChunk(64 * KB));
	WithContext.apply(memory);
	const context = { cpu, memory };

	initializeMemory(memory);
	cpu.loadContext(context);
	context.context = context;

	return context;
};
