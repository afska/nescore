if (process.env.NODE_ENV !== "production") {
	// HACK: WebWorkers/Webpack integration fix
	global.$RefreshReg$ = () => {};
	global.$RefreshSig$ = () => () => {};
}

const WebWorker = require("./WebWorker").default;
const webWorker = new WebWorker((msg) => postMessage(msg));

onmessage = function(message) {
	webWorker.$onMessage(message);
};
