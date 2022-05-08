import DebugNameTable from "./DebugNameTable";
import DebugPatternTable from "./DebugPatternTable";

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const TILE_LENGTH = 8;

/** Debug functions */
// debug.nes
// debug.drawTiles();
// debug.drawBackground();
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

		drawTiles(patternTableId = 0) {
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

				try {
					while (true) drawTile();
				} catch (e) {}
			});
		},

		drawBackground(nameTableId = 0) {
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
