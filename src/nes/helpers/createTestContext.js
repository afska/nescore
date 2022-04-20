import CPU from "../cpu";
import CPUMemoryMap from "../cpu/CPUMemoryMap";
import { PPURegisterSegment } from "../ppu/registers";
import { MemoryChunk } from "../memory";
import { WithContext } from "../helpers";

const MAPPER_SIZE = 0xbfe0;
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

/** Creates a mocked test context for CPUMemoryMap testing. */
export const createTestContextForCPUMemoryMap = () => {
	const context = {};
	context.ppu = { registers: new PPURegisterSegment(context) };
	context.mapper = new MemoryChunk(MAPPER_SIZE);
	context.memory = new CPUMemoryMap().loadContext(context);

	return context;
};
