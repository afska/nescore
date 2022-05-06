if (process.env.NODE_ENV !== "production") {
	// HACK: WebWorkers/Webpack integration fix
	global.$RefreshReg$ = () => {};
	global.$RefreshSig$ = () => () => {};
}
const NES = require("../../nes").default;

const nes = new NES();

onmessage = function({ data }) {
	try {
		if (data instanceof Uint8Array) {
			// rom bytes
			nes.load(data);
		} else if (Array.isArray(data)) {
			// frame request (with controller input)
			for (let i = 0; i < 2; i++) {
				for (let button in data[i])
					nes.setButton(i + 1, button, data[i][button]);
			}
			const frameBuffer = nes.frame();
			postMessage(frameBuffer);
		}
	} catch (error) {
		postMessage({ id: "error", error });
	}
};
