import GameCartridge from "./GameCartridge";
import chai from "chai";
import fs from "fs";
chai.Should();

describe("GameCartridge", () => {
	it("can read the header", () => {
		const buffer = fs.readFileSync("public/rom.nes");
		const bytes = new Uint8Array(buffer);

		new GameCartridge(bytes).header.should.eql("NES");
	});
});
