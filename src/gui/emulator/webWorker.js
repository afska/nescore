if (process.env.NODE_ENV !== "production") {
	// HACK: WebWorkers/Webpack integration fix
	global.$RefreshReg$ = () => {};
	global.$RefreshSig$ = () => () => {};
}
const NES = require("../../nes").default;

const nes = new NES();

onmessage = function({ data }) {
	if (data instanceof Uint8Array) nes.load(data);
	else if (Array.isArray(data)) {
		for (let i = 0; i < 2; i++) {
			for (let button in data[i]) nes.setButton(i + 1, button, data[i][button]);
		}
		const frameBuffer = nes.frame();
		postMessage(frameBuffer);
	}
};
