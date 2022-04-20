import { createTestContextForCPUMemoryMap } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2005;

describe("CPU/PPU registers interaction", () => {
	describe("PPUScroll", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
			register = ppu.registers.ppuScroll;
		});

		it("is write-only", () => {
			memory.writeAt(ADDRESS, 123);
			register.value.should.equal(123);
			memory.readAt(ADDRESS).should.equal(0);
		});
	});
});
