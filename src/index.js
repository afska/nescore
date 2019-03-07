import NES from "./nes/NES";
import { Buffer } from "buffer";
import "./gui";

const DEMO = async () => {
	const response = await fetch("rom.nes");
	const arrayBuffer = await response.arrayBuffer();
	const bytes = Buffer.from(arrayBuffer);

	window.bytes = bytes;
	window.nes = new NES();

	window.nes.load(bytes);
	// while (true) window.nes.step();
};

DEMO();
