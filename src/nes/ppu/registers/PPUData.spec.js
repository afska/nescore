import { createTestContextForCPUMemoryMap } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2007;

describe("CPU/PPU registers interaction", () => {
	describe("PPUData", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
			register = ppu.registers.ppuData;
		});

		it("// TODO", () => {
			// TODO: TEST
		});
	});
});
