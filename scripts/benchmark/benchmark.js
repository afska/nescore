const NES = require("nes-emu").default;
const fs = require("fs");
const { performance } = require("perf_hooks");
const _ = require("lodash");

const file = process.argv[2];
if (!file) {
	console.log("Usage:\nnode benchmark.js rom.nes");
	process.exit(1);
}

const rom = fs.readFileSync(process.argv[2]);
const nes = new NES();

nes.load(rom);

let frames = 0;
let fpsMarks = [];
let runTime = 0;
let secondTime = 0;

while (true) {
	const t0 = performance.now();
	nes.frame();
	const t1 = performance.now();

	const elapsedMs = t1 - t0;
	frames++;
	runTime += elapsedMs;
	secondTime += elapsedMs;

	if (secondTime > 1000) {
		console.log(frames);
		fpsMarks.push(frames);
		secondTime = 0;
		frames = 0;
	}

	if (runTime > 5000) {
		console.log("AVERAGE:", _.mean(fpsMarks));
		console.log("RELOADING...");
		nes.load(rom);
		runTime = 0;
		fpsMarks = [];
	}
}
