import { createTestContextForMemory } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x4014;

describe("CPU/PPU registers interaction", () => {
	describe("OAMDMA", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForMemory());
			register = ppu.registers.oamDma;
		});

		it("// TODO", () => {
			// TODO: TEST
		});
	});
});
