import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2004;

describe("CPU/PPU registers interaction", () => {
	describe("OAMData", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContext());
			register = ppu.registers.oamData;
		});

		it("can write OAM, incrementing OAMAddr", () => {
			ppu.registers.oamAddr.setValue(3);

			memory.writeAt(ADDRESS, 24);

			ppu.oamRam.readAt(3).should.equal(24);
			ppu.registers.oamAddr.value.should.equal(4);
		});

		it("can read OAM", () => {
			ppu.oamRam.writeAt(3, 84);

			ppu.registers.oamAddr.setValue(3);
			memory.readAt(ADDRESS).should.equal(84);
		});
	});
});
