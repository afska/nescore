import CPU from "../cpu";
import CPUMemoryMap from "../cpu/CPUMemoryMap";
import PPUMemoryMap from "../ppu/PPUMemoryMap";
import { PPURegisterSegment } from "../ppu/registers";
import Controller from "../controller";
import { MemoryChunk } from "../memory";
import { WithContext } from "../helpers";
import constants from "../constants";

/** Creates a mocked test context for CPU testing. */
export default (initializeMemory = () => {}) => {
	const cpu = new CPU();
	const memory = (cpu.memory = new MemoryChunk(constants.CPU_ADDRESSED_MEMORY));
	WithContext.apply(memory);
	const context = {
		cpu,
		memoryBus: { cpu: memory },
		controllers: [new Controller(), new Controller()]
	};

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
	context.mapper = new MemoryChunk(constants.CPU_ADDRESSED_MAPPER_SIZE);
	context.controllers = [new Controller(), new Controller()];
	context.memoryBus = {
		cpu: new CPUMemoryMap().loadContext(context),
		ppu: new PPUMemoryMap().loadContext(context)
	};

	context.memory = context.memoryBus.cpu;
	context.context = context;

	return context;
};
