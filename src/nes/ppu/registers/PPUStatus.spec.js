import { createTestContextForCPUMemoryMap } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2002;

describe("CPU/PPU registers interaction", () => {
	describe("PPUStatus", () => {
		let ppu, memory;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
		});

		it("can read the register", () => {
			memory.readAt(ADDRESS).should.equal(0);

			ppu.registers.ppuStatus.spriteOverflow = 1;
			ppu.registers.ppuStatus.sprite0Hit = 1;

			memory.readAt(ADDRESS).should.equal(0b01100000);
		});
	});
});
