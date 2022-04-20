import { createTestContextForCPUMemoryMap } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2001;

describe("CPU/PPU registers interaction", () => {
	describe("PPUMask", () => {
		let ppu, memory;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
		});

		it("can write the register", () => {
			ppu.registers.ppuMask.showBackground.should.equal(0);
			ppu.registers.ppuMask.emphasizeRed.should.equal(0);
			ppu.registers.ppuMask.showSprites.should.equal(0);
			ppu.registers.ppuMask.emphasizeGreen.should.equal(0);

			memory.writeAt(ADDRESS, 0b00101000);

			ppu.registers.ppuMask.showBackground.should.equal(1);
			ppu.registers.ppuMask.emphasizeRed.should.equal(1);
			ppu.registers.ppuMask.showSprites.should.equal(0);
			ppu.registers.ppuMask.emphasizeGreen.should.equal(0);
		});
	});
});
