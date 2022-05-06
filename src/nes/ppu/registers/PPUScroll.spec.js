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
			register.value = 123;
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("writes X first, then Y", () => {
			memory.writeAt(ADDRESS, 13);
			register.x.should.equal(13);
			register.y.should.equal(0);

			memory.writeAt(ADDRESS, 58);
			register.x.should.equal(13);
			register.y.should.equal(58);

			memory.writeAt(ADDRESS, 29);
			register.x.should.equal(29);
			register.y.should.equal(58);
		});
	});
});
