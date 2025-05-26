import WebWorker from "./WebWorker";

const webWorker = new WebWorker((msg) => postMessage(msg));

onmessage = function(message) {
	webWorker.$onMessage(message);
};
