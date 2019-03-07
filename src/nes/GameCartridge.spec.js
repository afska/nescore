import GameCartridge from "./GameCartridge";
import fs from "fs";
const should = require("chai").Should();

describe("GameCartridge", () => {
	let bytes;

	beforeEach(() => {
		bytes = fs.readFileSync("public/testroms/nestest.nes");
	});

	it("can read the header", () => {
		new GameCartridge(bytes).header.should.eql({
			prgRomPages: 1,
			chrRomPages: 1,
			hasTrainerBeforeProgram: false,
			mirroringMode: 0
		});
	});

	it("can read the magic number", () => {
		new GameCartridge(bytes).magicNumber.should.equal("NES");
	});
});
