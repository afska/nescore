import NES from "./nes/NES";
import { Buffer } from "buffer";
import "./gui";

const DEMO = async () => {
	const response = await fetch("testroms/nestest.nes");
	const arrayBuffer = await response.arrayBuffer();
	const bytes = Buffer.from(arrayBuffer);

	window.bytes = bytes;
	window.nes = new NES();

	window.nes.load(bytes);
	window.nes.cpu.pc.value = 0xc000;
	// while (true) window.nes.step();
};

DEMO();
