import createTestContext from "../../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x2007;

describe("CPU/PPU registers interaction", () => {
	describe("PPUData", () => {
		let cpu, ppu, memoryBus, register;

		beforeEach(() => {
			({ cpu, ppu, memoryBus } = createTestContext());
			register = ppu.registers.ppuData;
		});

		it("can write VRAM", () => {
			ppu.registers.ppuAddr.address = 0x2016;
			memoryBus.cpu.writeAt(ADDRESS, 24);
			ppu.memory.readAt(0x2016).should.equal(24);
		});

		it("can read VRAM, delayed by 1", () => {
			ppu.memory.writeAt(0x2016, 84);

			ppu.registers.ppuAddr.address = 0x2016;
			cpu.memory.readAt(ADDRESS).should.equal(0);

			ppu.memory.writeAt(0x2016, 92);

			ppu.registers.ppuAddr.address = 0x2016;
			cpu.memory.readAt(ADDRESS).should.equal(84);

			ppu.registers.ppuAddr.address = 0x2016;
			cpu.memory.readAt(ADDRESS).should.equal(92);
		});

		it("can read Palette RAM without delays", () => {
			ppu.memory.writeAt(0x3f10, 123);

			ppu.registers.ppuAddr.address = 0x3f10;
			cpu.memory.readAt(ADDRESS).should.equal(123);
		});

		describe("PPUAddr increment", () => {
			const run = (operation) => {
				if (operation === "write") memoryBus.cpu.writeAt(ADDRESS, 24);
				else cpu.memory.readAt(ADDRESS);
			};

			["write", "read"].forEach((operation) => {
				it(`${operation}: increments PPUAddr by 1 if bit 2 of PPUCtrl is 0`, () => {
					ppu.registers.ppuCtrl.setValue(0b00000000);
					ppu.registers.ppuAddr.address = 0x2016;

					run(operation);

					ppu.registers.ppuAddr.address.should.equal(0x2017);
				});

				it(`${operation}: increments PPUAddr by 32 if bit 2 of PPUCtrl is 1`, () => {
					ppu.registers.ppuCtrl.setValue(0b00000100);
					ppu.registers.ppuAddr.address = 0x2016;

					run(operation);

					ppu.registers.ppuAddr.address.should.equal(0x2036);
				});
			});
		});
	});
});
