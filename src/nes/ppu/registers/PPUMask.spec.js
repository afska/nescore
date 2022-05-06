import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2001;

describe("CPU/PPU registers interaction", () => {
	describe("PPUMask", () => {
		let ppu, memory, register;

		beforeEach(() => {
			({ ppu, memory } = createTestContext());
			register = ppu.registers.ppuMask;
		});

		it("is write-only", () => {
			memory.writeAt(ADDRESS, 123);
			register.value.should.equal(123);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("can write the register", () => {
			register.showBackground.should.equal(0);
			register.emphasizeRed.should.equal(0);
			register.showSprites.should.equal(0);
			register.emphasizeGreen.should.equal(0);

			memory.writeAt(ADDRESS, 0b00101000);

			register.showBackground.should.equal(1);
			register.emphasizeRed.should.equal(1);
			register.showSprites.should.equal(0);
			register.emphasizeGreen.should.equal(0);
		});

		describe("transform", () => {
			it("returns the same color if no transformation is applied", () => {
				register.transform(0xe821d9).should.equal(0xe821d9);
			});

			it("can transform a color to grayscale", () => {
				register.grayscale = 1;

				register.transform(0xc72631).should.equal(0x5e5e5e);
			});

			it("can transform a color emphasizing red", () => {
				register.emphasizeRed = 1;

				register.transform(0xc72631).should.equal(0x420c31);
			});

			it("can transform a color emphasizing green", () => {
				register.emphasizeGreen = 1;

				register.transform(0xc72631).should.equal(0x422610);
			});

			it("can transform a color emphasizing blue", () => {
				register.emphasizeBlue = 1;

				register.transform(0xc72631).should.equal(0xc70c10);
			});

			it("can emphasize two colors at the same time", () => {
				register.emphasizeRed = 1;
				register.emphasizeBlue = 1;

				register.transform(0xc72631).should.equal(0xc70c31);
			});

			it("applies emphasis bits independently of grayscale", () => {
				register.grayscale = 1;
				register.emphasizeRed = 1;
				register.emphasizeBlue = 1;

				register.transform(0xc72631).should.equal(0x5e1f5e);
			});
		});
	});
});
