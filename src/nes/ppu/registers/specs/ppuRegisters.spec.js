import { createTestContextForCPUMemoryMap } from "../../../helpers/createTestContext";
const should = require("chai").Should();

describe("registers", () => {
	describe("CPU/PPU registers interaction", () => {
		let ppu, memory;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForCPUMemoryMap());
		});

		describe("PPUCtrl", () => {
			it("is write-only", () => {
				memory.writeAt(0x2000, 123);
				ppu.registers.ppuCtrl.value.should.equal(123);
				memory.readAt(0x2000).should.equal(0);
			});

			it("can return the base Nametable address", () => {
				memory.writeAt(0x2000, 0b00000000);
				ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2000);

				memory.writeAt(0x2000, 0b00000001);
				ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2400);

				memory.writeAt(0x2000, 0b00000010);
				ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2800);

				memory.writeAt(0x2000, 0b00000011);
				ppu.registers.ppuCtrl.baseNametableAddress.should.equal(0x2c00);
			});

			it("can return the VRAM address increment", () => {
				memory.writeAt(0x2000, 0b00000000);
				ppu.registers.ppuCtrl.vramAddressIncrement.should.equal(1);

				memory.writeAt(0x2000, 0b00000100);
				ppu.registers.ppuCtrl.vramAddressIncrement.should.equal(32);
			});

			it("can return the Pattern table address for 8x8 sprites", () => {
				memory.writeAt(0x2000, 0b00000000);
				ppu.registers.ppuCtrl.patternTableAddressFor8x8Sprites.should.equal(
					0x0000
				);

				memory.writeAt(0x2000, 0b00001000);
				ppu.registers.ppuCtrl.patternTableAddressFor8x8Sprites.should.equal(
					0x1000
				);
			});

			it("can return the Pattern table address for background", () => {
				memory.writeAt(0x2000, 0b00000000);
				ppu.registers.ppuCtrl.patternTableAddressForBackground.should.equal(
					0x0000
				);

				memory.writeAt(0x2000, 0b00010000);
				ppu.registers.ppuCtrl.patternTableAddressForBackground.should.equal(
					0x1000
				);
			});

			it("provides the sprite width", () => {
				ppu.registers.ppuCtrl.spriteWidth.should.equal(8);
			});

			it("provides the sprite height", () => {
				memory.writeAt(0x2000, 0b00000000);
				ppu.registers.ppuCtrl.spriteHeight.should.equal(8);

				memory.writeAt(0x2000, 0b00100000);
				ppu.registers.ppuCtrl.spriteHeight.should.equal(16);
			});
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

		describe("OAMAddr", () => {
			// ...
		});

		describe("OAMData", () => {
			// ...
		});

		describe("PPUScroll", () => {
			// ...
		});

		describe("PPUAddr", () => {
			// ...
		});

		describe("PPUData", () => {
			// ...
		});
	});
});
