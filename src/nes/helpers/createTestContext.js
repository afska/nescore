import CPU from "../cpu";
import CPUMemoryMap from "../cpu/CPUMemoryMap";
import PPUMemoryMap from "../ppu/PPUMemoryMap";
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

	context.memory = context.memoryBus.cpu;
	context.context = context;

	return context;
};

/** Creates a mocked test context for memory testing. */
export const createTestContextForMemory = () => {
	const context = {};
	context.ppu = { registers: new PPURegisterSegment(context) };
	context.mapper = new MemoryChunk(MAPPER_SIZE);
	context.memoryBus = {
		cpu: new CPUMemoryMap().loadContext(context),
		ppu: new PPUMemoryMap().loadContext(context)
	};

	context.memory = context.memoryBus.cpu;
	context.context = context;

	return context;
};
