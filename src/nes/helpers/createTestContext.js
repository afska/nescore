import CPU from "../cpu";
import { MemoryChunk } from "../memory";
import { WithContext } from "../helpers";

const KB = 1024;

/** Creates a mocked test context for CPU testing. */
export default (initializeMemory = () => {}) => {
	const cpu = new CPU();
	const memory = (cpu.memory = new MemoryChunk(64 * KB));
	WithContext.apply(memory);
	const context = { cpu, memoryBus: { cpu: memory } };

	initializeMemory(memory);
	cpu.loadContext(context);

	context.memory = memory;
	context.context = context;

	return context;
};
