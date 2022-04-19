import DebugNameTable from "../../nes/ppu/debug/DebugNameTable";
import DebugPatternTable from "../../nes/ppu/debug/DebugPatternTable";

const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const TILE_SIZE = 8;

export default (emulator) => {
	return {
		emulator,

		drawTiles() {
			this.draw((plot) => {
				let tile = 0;

				const drawTile = () => {
					const startX = (tile * TILE_SIZE) % SCREEN_WIDTH;
					const startY =
						Math.floor((tile * TILE_SIZE) / SCREEN_WIDTH) * TILE_SIZE;

					new DebugPatternTable()
						.loadContext(this.emulator.nes.context)
						.renderTile(tile, plot, startX, startY);

					tile++;
				};

				try {
					while (true) drawTile();
				} catch (e) {}
			});
		},

		drawNameTable(id = 0) {
			this.draw((plot) => {
				new DebugNameTable()
					.loadContext(this.emulator.nes.context)
					.renderNameTable(id, plot);
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
};
