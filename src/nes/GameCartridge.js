export default class GameCartridge {
	constructor(bytes) {
		this.bytes = bytes;
	}

	get header() {
		return Array.from(this.bytes.slice(0, 3))
			.map((it) => String.fromCharCode(it))
			.join("");
	}
}
