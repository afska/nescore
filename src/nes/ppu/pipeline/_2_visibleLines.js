import { Byte } from "../../helpers";

const START_ADDRESS = 0x2000;
const NAME_TABLE_SIZE = 1024;
const TILE_SIZE = 8;
const PATTERN_TABLE_SIZE = 0x1000;
const TILE_SIZE_BYTES = 16;
const TOTAL_TILES_X = 32;
const TEST_PALETTE = [0xffffff, 0xcecece, 0x686868, 0x000000];

export default ({ ppu, memoryBus }) => {
	// TODO: REFACTOR
	if (ppu.cycle % 8 === 0) {
		// every 8 cycles, draw 1 tile row
		if (ppu.cycle < 256) {
			const x = ppu.cycle;
			const y = ppu.scanline;

			const startAddress = START_ADDRESS + 0 * NAME_TABLE_SIZE;
			const patternTableId =
				ppu.registers.ppuCtrl.patternTableAddressIdForBackground;

			const tileX = Math.floor(x / 8);
			const tileY = Math.floor(y / 8);
			const tileIndex = tileY * TOTAL_TILES_X + tileX;
			const tileId = memoryBus.ppu.readAt(startAddress + tileIndex);
			const insideY = y % 8; // row # inside pattern table

			/**
			 * RENDER PATTERN TABLE ROW
			 */
			const startAddressPattern = 0x0000 + patternTableId * PATTERN_TABLE_SIZE;
			const memory = memoryBus.ppu;
			const firstPlane = tileId * TILE_SIZE_BYTES;
			const secondPlane = firstPlane + TILE_SIZE_BYTES / 2;

			const row1 = memory.readAt(startAddressPattern + firstPlane + insideY);
			const row2 = memory.readAt(startAddressPattern + secondPlane + insideY);

			for (let xx = 0; xx < TILE_SIZE; xx++) {
				const column = TILE_SIZE - 1 - xx;
				const lsb = Byte.getBit(row1, column);
				const msb = Byte.getBit(row2, column);
				const color = (msb << 1) | lsb;

				ppu.plot(x + xx, y, TEST_PALETTE[color]);
			}
			/**
			 *
			 */
		}
	}
};
