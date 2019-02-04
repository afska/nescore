export default async () => {
	const rom = await fetch("rom.nes");
	const buffer = await rom.arrayBuffer();
	const bytes = new Uint8Array(buffer);

	window.bytes = bytes;

	const header = Array.from(bytes.slice(0, 3))
		.map((it) => String.fromCharCode(it))
		.join("");

	return header;
};
