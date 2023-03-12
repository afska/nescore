import DebugPatternTable from "./DebugPatternTable";
import { WithContext } from "../../../nes/helpers";

const START_ADDRESS = 0x2000;
const NAME_TABLE_SIZE = 1024;
const TILE_LENGTH = 8;
const TOTAL_TILES_X = 32;

/** Utility class to draw complete backgrounds from Name tables. */
export default class DebugNameTable {
	constructor() {
		WithContext.apply(this);
	}

	/** Renders the background from `nameTableId` using the `plot`(x, y, bgrColor) function. */
	renderBackground(nameTableId, plot) {
		this.requireContext();

		this.context.inDebugMode(() => {
			const startAddress = START_ADDRESS + nameTableId * NAME_TABLE_SIZE;
			const patternTableId = this.context.ppu.registers.ppuCtrl
				.patternTableAddressIdForBackground;

			for (let i = 0; i < NAME_TABLE_SIZE; i++) {
				const x = i % TOTAL_TILES_X;
				const y = Math.floor(i / TOTAL_TILES_X);
				const byte = this.context.ppu.memory.readAt(startAddress + i);

				new DebugPatternTable()
					.loadContext(this.context)
					.renderTile(
						patternTableId,
						byte,
						plot,
						x * TILE_LENGTH,
						y * TILE_LENGTH
					);
			}
		});
	}
}
