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

		it("provides the sprite mode", () => {
			memory.writeAt(ADDRESS, 0b00000000);
			register.isIn8x16Mode.should.equal(false);

			memory.writeAt(ADDRESS, 0b00100000);
			register.isIn8x16Mode.should.equal(true);
		});
	});
});
