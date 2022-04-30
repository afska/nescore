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
			memory.writeAt(ADDRESS, 123);
			register.value.should.equal(123);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("can return the VRAM address increment", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.vramAddressIncrement.should.equal(1);

			memory.writeAt(ADDRESS, 0b00000100);
			register.vramAddressIncrement.should.equal(32);
		});

		it("provides the sprite height", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.spriteHeight.should.equal(8);

			memory.writeAt(ADDRESS, 0b00100000);
			register.spriteHeight.should.equal(16);
		});
	});
});
