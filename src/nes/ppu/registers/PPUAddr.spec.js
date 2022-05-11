import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2006;

describe("CPU/PPU registers interaction", () => {
	describe("PPUAddr", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContext());
			register = ppu.registers.ppuAddr;
		});

		it("is write-only", () => {
			register.value = 123;
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("writes the MSB first, then the LSB", () => {
			memory.writeAt(ADDRESS, 0x12);
			memory.writeAt(ADDRESS, 0x24);
			register.address.should.equal(0x1224);
		});
	});
});
