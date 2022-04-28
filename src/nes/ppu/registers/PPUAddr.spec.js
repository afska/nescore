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
			memory.writeAt(ADDRESS, 0xd3);
			register.value.should.equal(0xd300);

			memory.writeAt(ADDRESS, 0xb8);
			register.value.should.equal(0xd3b8);

			memory.writeAt(ADDRESS, 0x9f);
			register.value.should.equal(0x9fb8);
		});
	});
});
