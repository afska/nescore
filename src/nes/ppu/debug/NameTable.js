// TODO: DEBUG

import { Byte } from "../../helpers";

const START_ADDRESS = 0x0000;
const TILE_SIZE_X = 8;
const TILE_SIZE_Y = 8;
const TILE_SIZE_BYTES = 16;

const palette = [0xffffff, 0xcecece, 0x686868, 0x000000];

export default (nametableId = 0) => {
	const nes = window.nes;

	const frameBuffer = new Uint32Array(256 * 240);
	const plot = (x, y, color) => {
		frameBuffer[y * 256 + x] = color;
	};

	for (let i = 0; i < 1024; i++) {
		const startAddress = 0x2000 + 1024 * nametableId;

		try {
			nes.context.isDebugging = true;

			const x = i % 32;
			const y = Math.floor(i / 32);
			const byte = nes.context.memoryBus.ppu.readAt(startAddress + i);

			/*---------*/
			const ppuBus = nes.context.memoryBus.ppu;
			const id = byte;
			const startX = x * 8;
			const startY = y * 8;
			const firstPlane = id * TILE_SIZE_BYTES;
			const secondPlane = firstPlane + TILE_SIZE_BYTES / 2;

			for (let y = 0; y < TILE_SIZE_Y; y++) {
				const row1 = ppuBus.readAt(START_ADDRESS + firstPlane + y);
				const row2 = ppuBus.readAt(START_ADDRESS + secondPlane + y);

				for (let x = 0; x < TILE_SIZE_X; x++) {
					const column = TILE_SIZE_X - 1 - x;
					const lsb = Byte.getBit(row1, column);
					const msb = Byte.getBit(row2, column);
					const color = (msb << 1) | lsb;

					plot(startX + x, startY + y, palette[color]);
				}
			}
		} finally {
			nes.context.isDebugging = false;
		}
	}

	return frameBuffer;
};
