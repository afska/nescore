import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2002;

describe("CPU/PPU registers interaction", () => {
	describe("PPUStatus", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContext());
			register = ppu.registers.ppuStatus;
		});

		it("is read-only", () => {
			register.value = 123;
			memory.readAt(ADDRESS).should.equal(123);
			memory.writeAt(ADDRESS, 456);
			memory.readAt(ADDRESS).should.equal(123);
		});

		it("can read the register", () => {
			memory.readAt(ADDRESS).should.equal(0b10000000);

			register.spriteOverflow = 1;
			register.sprite0Hit = 1;

			memory.readAt(ADDRESS).should.equal(0b01100000);
		});

		describe("side effects", () => {
			it("resets the vertical blank flag on every read", () => {
				register.isInVBlankInterval = 1;

				memory.readAt(ADDRESS);

				register.isInVBlankInterval.should.equal(0);
			});

			it("resets PPUAddr's latch on every read", () => {
				ppu.loopy.latch = true;

				memory.readAt(ADDRESS);

				ppu.registers.ppuAddr.latch.should.equal(false);
			});
		});
	});
});
