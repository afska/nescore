import { createTestContextForMemory } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2004;

describe("CPU/PPU registers interaction", () => {
	describe("OAMData", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForMemory());
			register = ppu.registers.oamData;
		});

		it("// TODO", () => {
			// TODO: TEST
		});
	});
});
