import Cartridge from "./Cartridge";
import fs from "fs";
const should = require("chai").Should();

const ROM_FILE = "public/testroms/nestest.nes";

describe("Cartridge", () => {
	let bytes;

	beforeEach(() => {
		bytes = fs.readFileSync(ROM_FILE);
	});

	it("can read the header", () => {
		new Cartridge(bytes).header.should.eql({
			prgRomPages: 1,
			chrRomPages: 1,
			hasTrainerBeforeProgram: false,
			mapperId: 0
		});
	});

	it("can read the magic number", () => {
		new Cartridge(bytes).magicNumber.should.equal("NES");
	});
});
