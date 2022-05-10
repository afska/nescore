import DebugNameTable from "./DebugNameTable";
import DebugPatternTable from "./DebugPatternTable";

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const TILE_LENGTH = 8;
const TILES_PER_PATTERN_TABLE = 256;

/** Debug functions */
// debug.nes
// debug.tiles();
// debug.background();
// debug.stop();
// debug.resume();
export default function debug(emulator, webWorker) {
	return {
		emulator,
		webWorker,
		nes: webWorker.nes,
		frameTimer: webWorker.frameTimer,

		stop() {
			this.frameTimer.stop();
		},

		resume() {
			this.frameTimer.start();
		},

		tiles(patternTableId = 0) {
			if (!(patternTableId >= 0 && patternTableId <= 1))
				throw new Error(`Invalid Pattern table id: ${patternTableId}`);

			this.stop();

			this.draw((plot) => {
				let tile = 0;

				const drawTile = () => {
					const startX = (tile * TILE_LENGTH) % SCREEN_WIDTH;
					const startY =
						Math.floor((tile * TILE_LENGTH) / SCREEN_WIDTH) * TILE_LENGTH;

					new DebugPatternTable()
						.loadContext(this.nes.context)
						.renderTile(patternTableId, tile, plot, startX, startY);

					tile++;
				};

				for (let i = 0; i < TILES_PER_PATTERN_TABLE; i++) drawTile();
			});
		},

		background(nameTableId = 0) {
			if (!(nameTableId >= 0 && nameTableId <= 3))
				throw new Error(`Invalid Name table id: ${nameTableId}`);

			this.stop();

			this.draw((plot) => {
				new DebugNameTable()
					.loadContext(this.nes.context)
					.renderBackground(nameTableId, plot);
			});
		},

		draw(action) {
			const frameBuffer = new Uint32Array(SCREEN_WIDTH * SCREEN_HEIGHT);
			const plot = (x, y, color) => {
				frameBuffer[y * SCREEN_WIDTH + x] = color;
			};

			action(plot);

			this.emulator.screen.setBuffer(frameBuffer);
		}
	};
}
