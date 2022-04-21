import { createTestContextForMemory } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2000;

describe("CPU/PPU registers interaction", () => {
	describe("PPUCtrl", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForMemory());
			register = ppu.registers.ppuCtrl;
		});

		it("is write-only", () => {
			memory.writeAt(ADDRESS, 123);
			register.value.should.equal(123);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("can return the base Name table address", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.baseNameTableAddress.should.equal(0x2000);

			memory.writeAt(ADDRESS, 0b00000001);
			register.baseNameTableAddress.should.equal(0x2400);

			memory.writeAt(ADDRESS, 0b00000010);
			register.baseNameTableAddress.should.equal(0x2800);

			memory.writeAt(ADDRESS, 0b00000011);
			register.baseNameTableAddress.should.equal(0x2c00);
		});

		it("can return the VRAM address increment", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.vramAddressIncrement.should.equal(1);

			memory.writeAt(ADDRESS, 0b00000100);
			register.vramAddressIncrement.should.equal(32);
		});

		it("can return the Pattern table address for 8x8 sprites", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.patternTableAddressFor8x8Sprites.should.equal(0x0000);

			memory.writeAt(ADDRESS, 0b00001000);
			register.patternTableAddressFor8x8Sprites.should.equal(0x1000);
		});

		it("can return the Pattern table address for background", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.patternTableAddressForBackground.should.equal(0x0000);

			memory.writeAt(ADDRESS, 0b00010000);
			register.patternTableAddressForBackground.should.equal(0x1000);
		});

		it("provides the sprite width", () => {
			register.spriteWidth.should.equal(8);
		});

		it("provides the sprite height", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.spriteHeight.should.equal(8);

			memory.writeAt(ADDRESS, 0b00100000);
			register.spriteHeight.should.equal(16);
		});
	});
});
