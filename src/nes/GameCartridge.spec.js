import GameCartridge from "./GameCartridge";
import fs from "fs";
const should = require("chai").Should();

describe("GameCartridge", () => {
	it("can read the header", () => {
		const bytes = fs.readFileSync("public/rom.nes");
		new GameCartridge(bytes).nesConstant.should.equal("NES");
	});
});
