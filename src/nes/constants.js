const KB = 1024;
const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const TILE_SIZE = 8;
const ATTRIBUTE_TABLE_BLOCK_SIZE = 32;
const ATTRIBUTE_TABLE_REGION_SIZE = 16;

export default {
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	TOTAL_PIXELS: SCREEN_WIDTH * SCREEN_HEIGHT,
	BUTTONS: 8,

	ROM_MAGIC_NUMBER: "NES",
	ROM_HEADER_SIZE: 16,
	ROM_TRAINER_SIZE: 512,
	PRG_ROM_PAGE_SIZE: 16 * KB,
	CHR_ROM_PAGE_SIZE: 8 * KB,

	PPU_CYCLES_PER_CPU_CYCLE: 3,

	CPU_ADDRESSED_MEMORY: 64 * KB,
	CPU_ADDRESSED_MAPPER_SIZE: 0xbfe0,

	PPU_ADDRESSED_PALETTE_RAM_START_ADDRESS: 0x3f00,
	PPU_RENDER_FREQUENCY: 8,

	PPU_OAM_SIZE: 256,
	PPU_LAST_CYCLE: 340,
	PPU_LAST_SCANLINE: 260,
	OAMDMA_CYCLES: 513,

	TILE_SIZE,
	TILE_SIZE_BYTES: 16,
	SPRITE_LIMIT: 8,

	NAME_TABLES_START_ADDRESS: 0x2000,
	NAME_TABLE_TOTAL_TILES_X: SCREEN_WIDTH / TILE_SIZE,
	NAME_TABLE_SIZE: 1024,

	ATTRIBUTE_TABLE_BLOCK_SIZE,
	ATTRIBUTE_TABLE_TOTAL_BLOCKS_X: SCREEN_WIDTH / ATTRIBUTE_TABLE_BLOCK_SIZE,
	ATTRIBUTE_TABLE_REGION_SIZE,
	ATTRIBUTE_TABLE_TOTAL_REGIONS_X:
		ATTRIBUTE_TABLE_BLOCK_SIZE / ATTRIBUTE_TABLE_REGION_SIZE,
	ATTRIBUTE_TABLE_REGION_SIZE_BITS: 2,
	ATTRIBUTE_TABLE_SIZE: 64,

	PATTERN_TABLES_START_ADDRESS: 0x0000,
	PATTERN_TABLE_SIZE: 0x1000,

	PALETTE_SIZE: 4,

	NESTEST_PATH: "./public/testroms/nestest.nes"
};
