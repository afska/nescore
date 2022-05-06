if (process.env.NODE_ENV !== "production") {
	// HACK: WebWorkers/Webpack integration fix
	global.$RefreshReg$ = () => {};
	global.$RefreshSig$ = () => () => {};
}
const NES = require("../../nes").default;

console.log("Web Worker started!");

const nes = new NES();

onmessage = function({ data }) {
	if (data instanceof Uint8Array) nes.load(data);
	else if (data === "frame") {
		const frameBuffer = nes.frame();
		postMessage(frameBuffer);
	}
};
