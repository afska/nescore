import GameCartridge from "./GameCartridge";
import chai from "chai";
import fs from "fs";
chai.Should();

describe("GameCartridge", () => {
	it("can read the header", () => {
		const bytes = fs.readFileSync("public/rom.nes");
		new GameCartridge(bytes).header.should.eql("NES");
	});
});
