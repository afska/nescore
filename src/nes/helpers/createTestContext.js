import NES from "../NES";
import config from "../../nes/config";
import fs from "fs";

/** Creates an execution context for testing. */
export default function createTestContext(initialize = () => {}) {
	const romBytes = fs.readFileSync(config.NESTEST_PATH);
	const nes = new NES();
	nes.load(romBytes);

	const context = nes.context;

	initialize(context);

	context.memory = context.cpu.memory;
	context.context = context;

	nes.onLoad(context);

	return context;
}
