import CPU from "../cpu";
import CPUMemoryMap from "../cpu/CPUMemoryMap";
import PPUMemoryMap from "../ppu/PPUMemoryMap";
import { PPURegisterSegment } from "../ppu/registers";
import Controller from "../controller";
import { MemoryChunk } from "../memory";
import constants from "../constants";
import { WithContext } from "../helpers";

/** Creates a mocked test context for CPU testing. */
export default (initializeMemory = () => {}) => {
	const cpu = new CPU();
	const memory = (cpu.memory = new MemoryChunk(constants.CPU_ADDRESSED_MEMORY));
	WithContext.apply(memory);
	const controllerPorts = Controller.createPorts();
	const context = {
		cpu,
		memoryBus: { cpu: memory },
		controllers: [
			new Controller(controllerPorts.primary),
			new Controller(controllerPorts.secondary)
		]
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
	const controllerPorts = Controller.createPorts();
	context.controllers = [
		new Controller(controllerPorts.primary),
		new Controller(controllerPorts.secondary)
	];
	context.memoryBus = {
		cpu: new CPUMemoryMap().loadContext(context),
		ppu: new PPUMemoryMap().loadContext(context)
	};

	context.memory = context.memoryBus.cpu;
	context.context = context;

	return context;
};
