import { createTestContextForCPUMemoryMap } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2000;

describe("CPU/PPU registers interaction", () => {
	describe("PPUCtrl", () => {
		let ppu, memory;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
		});

		it("is write-only", () => {
			memory.writeAt(ADDRESS, 123);
			ppu.registers.ppuCtrl.value.should.equal(123);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("can return the base Nametable address", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2000);

			memory.writeAt(ADDRESS, 0b00000001);
			ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2400);

			memory.writeAt(ADDRESS, 0b00000010);
			ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2800);

			memory.writeAt(ADDRESS, 0b00000011);
			ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2c00);
		});

		it("can return the VRAM address increment", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			ppu.registers.ppuCtrl.vramAddressIncrement.should.equal(1);

			memory.writeAt(ADDRESS, 0b00000100);
			ppu.registers.ppuCtrl.vramAddressIncrement.should.equal(32);
		});

		it("can return the Pattern table address for 8x8 sprites", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			ppu.registers.ppuCtrl.patternTableAddressFor8x8Sprites.should.equal(
				0x0000
			);

			memory.writeAt(ADDRESS, 0b00001000);
			ppu.registers.ppuCtrl.patternTableAddressFor8x8Sprites.should.equal(
				0x1000
			);
		});

		it("can return the Pattern table address for background", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			ppu.registers.ppuCtrl.patternTableAddressForBackground.should.equal(
				0x0000
			);

			memory.writeAt(ADDRESS, 0b00010000);
			ppu.registers.ppuCtrl.patternTableAddressForBackground.should.equal(
				0x1000
			);
		});

		it("provides the sprite width", () => {
			ppu.registers.ppuCtrl.spriteWidth.should.equal(8);
		});

		it("provides the sprite height", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			ppu.registers.ppuCtrl.spriteHeight.should.equal(8);

			memory.writeAt(ADDRESS, 0b00100000);
			ppu.registers.ppuCtrl.spriteHeight.should.equal(16);
		});
	});
});
