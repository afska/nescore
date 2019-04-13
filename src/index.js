import NES from "./nes/NES";
import NESTestLogger from "./nes/NESTestLogger";
import { Buffer } from "buffer";
import "./gui";

const DEMO = async () => {
	const response = await fetch("testroms/nestest.nes");
	const arrayBuffer = await response.arrayBuffer();
	const bytes = Buffer.from(arrayBuffer);

	window.bytes = bytes;
	window.nes = new NES(NESTestLogger);

	window.nes.load(bytes);
	window.nes.cpu.pc.value = 0xc000;

	const logResponse = await fetch("testroms/nestest.log");
	const logText = await logResponse.text();
	const logLines = logText.split(/\n|\r\n|\r/);

	const withoutPpu = (line) =>
		line && line.replace(/PPU: *\d+, *\d+ CYC:/, "CYC:");
	let line = 0;
	window.getDiff = () => {
		window.nes.step();
		const diff = {
			actual: withoutPpu(window.lastLog),
			expected: withoutPpu(logLines[line])
		};
		line++;
		return diff;
	};
};

DEMO();
