import createTestContext from "../../helpers/createTestContext";
import { Byte } from "../../helpers";
const should = require("chai").Should();

const ADDRESS = 0x4014;

describe("CPU/PPU registers interaction", () => {
	describe("OAMDMA", () => {
		let cpu, ppu, memory, register;

		beforeEach(() => {
			({ cpu, ppu, memory } = createTestContext());
			register = ppu.registers.oamDma;
		});

		it("is write-only", () => {
			register.value = 123;
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("copies the whole page to OAM and add 514 cycles", () => {
			for (let i = 0; i < 256; i++)
				memory.writeAt(Byte.to16Bit(0x06, i), 255 - i);

			memory.writeAt(ADDRESS, 0x06);

			for (let i = 0; i < 256; i++) ppu.oamRam.readAt(i).should.equal(255 - i);
			cpu.extraCycles.should.equal(514);
		});
	});
});
