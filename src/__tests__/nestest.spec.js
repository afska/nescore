import NES from "../nes";
import NESTestLogger from "../nes/loggers/NESTestLogger";
import constants from "../nes/constants";
import fs from "fs";
const should = require("chai").Should();

const LOG_FILE = "./public/testroms/nestest.log";
const FINAL_LINE = 5004;

const withoutPpu = (line) =>
	line && line.replace(/PPU: *\d+, *\d+ CYC:/, "CYC:");

describe("NESTest", () => {
	it("matches the golden log with all official instructions", () => {
		const romBytes = fs.readFileSync(constants.NESTEST_PATH);
		const logText = fs.readFileSync(LOG_FILE).toString();
		const logLines = logText.split(/\n|\r\n|\r/).slice(0, FINAL_LINE);

		const logger = new NESTestLogger();
		const nes = new NES(logger);
		nes.load(romBytes);
		nes.cpu.pc.value = 0xc000;

		let line = 0;
		const step = () => {
			nes.step();
			const diff = {
				actual: withoutPpu(logger.lastLog),
				expected: withoutPpu(logLines[line])
			};

			diff.actual.should.equal(diff.expected);
			line++;
		};

		for (let i = 0; i < logLines.length - 1; i++) step();
	});
});
