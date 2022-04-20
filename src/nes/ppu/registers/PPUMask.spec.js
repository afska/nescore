import { createTestContextForCPUMemoryMap } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2001;

describe("CPU/PPU registers interaction", () => {
	describe("PPUMask", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
			register = ppu.registers.ppuMask;
		});

		it("is write-only", () => {
			memory.writeAt(ADDRESS, 123);
			register.value.should.equal(123);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("can write the register", () => {
			register.showBackground.should.equal(0);
			register.emphasizeRed.should.equal(0);
			register.showSprites.should.equal(0);
			register.emphasizeGreen.should.equal(0);

			memory.writeAt(ADDRESS, 0b00101000);

			register.showBackground.should.equal(1);
			register.emphasizeRed.should.equal(1);
			register.showSprites.should.equal(0);
			register.emphasizeGreen.should.equal(0);
		});
	});
});
