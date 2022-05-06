if (process.env.NODE_ENV !== "production") {
	// HACK: WebWorkers/Webpack integration fix
	global.$RefreshReg$ = () => {};
	global.$RefreshSig$ = () => () => {};
}
const NES = require("../../nes").default;
const FrameTimer = require("./FrameTimer").default;

let isDebugging = false;
let isDebugStepRequested = false;
const nes = new NES();
const frameTimer = new FrameTimer(
	() => {
		if (isDebugging && !isDebugStepRequested) return;

		const frameBuffer = nes.frame();
		frameTimer.countNewFrame();
		postMessage(frameBuffer);
		isDebugStepRequested = false;
	},
	(fps) => {
		postMessage({ id: "fps", fps });
	}
);

onmessage = function({ data }) {
	try {
		if (data instanceof Uint8Array) {
			// rom bytes
			nes.load(data);
			frameTimer.start();
		} else if (Array.isArray(data)) {
			// controller input
			for (let i = 0; i < 2; i++) {
				if (i === 0) {
					if (data[i].$startDebugging) isDebugging = true;
					if (data[i].$stopDebugging) isDebugging = false;
					if (data[i].$debugStep) isDebugStepRequested = true;
				}

				for (let button in data[i])
					if (button[0] !== "$") nes.setButton(i + 1, button, data[i][button]);
			}
		}
	} catch (error) {
		postMessage({ id: "error", error });
	}
};
