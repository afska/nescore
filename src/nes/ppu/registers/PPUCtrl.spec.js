import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2000;

describe("CPU/PPU registers interaction", () => {
	describe("PPUCtrl", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContext());
			register = ppu.registers.ppuCtrl;
		});

		it("is write-only", () => {
			memory.writeAt(ADDRESS, 120);
			register.value.should.equal(120);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("can return the VRAM address increment", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.vramAddressIncrement.should.equal(1);

			memory.writeAt(ADDRESS, 0b00000100);
			register.vramAddressIncrement.should.equal(32);
		});

		it("ignores changes on baseNameTableId when rendering is disabled", () => {
			ppu.registers.ppuMask.showBackground = 1;
			ppu.registers.ppuMask.showSprites = 0;

			memory.writeAt(ADDRESS, 0b00000001);
			register.baseNameTableId.should.equal(1);

			ppu.registers.ppuMask.showBackground = 0;
			ppu.registers.ppuMask.showSprites = 0;

			memory.writeAt(ADDRESS, 0b00000000);
			register.baseNameTableId.should.equal(1);
		});

		it("provides the sprite height", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.spriteHeight.should.equal(8);

			memory.writeAt(ADDRESS, 0b00100000);
			register.spriteHeight.should.equal(16);
		});
	});
});
