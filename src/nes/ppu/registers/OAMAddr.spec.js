import { createTestContextForMemory } from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2003;

describe("CPU/PPU registers interaction", () => {
	describe("OAMAddr", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContextForMemory());
			register = ppu.registers.oamAddr;
		});

		it("is write-only", () => {
			memory.writeAt(ADDRESS, 123);
			register.value.should.equal(123);
			memory.readAt(ADDRESS).should.equal(0);
		});
	});
});
