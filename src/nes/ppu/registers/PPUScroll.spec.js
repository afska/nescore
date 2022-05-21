import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2005;

describe("CPU/PPU registers interaction", () => {
	describe("PPUScroll", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContext());
			register = ppu.registers.ppuScroll;
		});

		it("is write-only", () => {
			register.setValue(123);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("writes X first, then Y", () => {
			memory.writeAt(ADDRESS, 13);
			memory.writeAt(ADDRESS, 58);

			// (copy temporal address to current address)
			ppu.loopy._copyX();
			ppu.loopy._copyY();

			register.scrolledX(0).should.equal(13);
			register.scrolledY().should.equal(58);
		});
	});
});
