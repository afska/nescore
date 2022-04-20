import { createTestContextForCPUMemoryMap } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2006;

describe("CPU/PPU registers interaction", () => {
	describe("PPUAddr", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
			register = ppu.registers.ppuAddr;
		});

		it("is write-only", () => {
			register.value = 123;
			memory.readAt(ADDRESS).should.equal(0);
		});

		// TODO: TEST PPUAddr
	});
});
