import { createTestContextForCPUMemoryMap } from "../../../helpers/createTestContext";
const should = require("chai").Should();

describe("registers", () => {
	describe("PPU registers", () => {
		let ppu, memory;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
		});

		describe("PPUMask", () => {
			it("can write the register", () => {
				ppu.registers.ppuMask.showBackground.should.equal(0);
				ppu.registers.ppuMask.emphasizeRed.should.equal(0);
				ppu.registers.ppuMask.showSprites.should.equal(0);
				ppu.registers.ppuMask.emphasizeGreen.should.equal(0);

				memory.writeAt(0x2001, 0b00101000);

				ppu.registers.ppuMask.showBackground.should.equal(1);
				ppu.registers.ppuMask.emphasizeRed.should.equal(1);
				ppu.registers.ppuMask.showSprites.should.equal(0);
				ppu.registers.ppuMask.emphasizeGreen.should.equal(0);
			});
		});

		describe("PPUStatus", () => {
			it("can read the register", () => {
				memory.readAt(0x2002).should.equal(0);

				ppu.registers.ppuStatus.spriteOverflow = 1;
				ppu.registers.ppuStatus.sprite0Hit = 1;

				memory.readAt(0x2002).should.equal(0b01100000);
			});
		});
	});
});
