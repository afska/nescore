import GameCartridge from "./GameCartridge";

export default async () => {
	const rom = await fetch("rom.nes");
	const buffer = await rom.arrayBuffer();
	const bytes = new Uint8Array(buffer);

	window.bytes = bytes;

	console.log(new GameCartridge(bytes).header);
};
