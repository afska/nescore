import { FlagsRegister } from ".";
const should = require("chai").Should();

describe("registers", () => {
	describe("FlagsRegister", () => {
		it("can load the flags from a byte", () => {
			new FlagsRegister().load(0b00111010).should.include({
				n: false,
				v: false,
				d: true,
				i: false,
				z: true,
				c: false
			});
		});

		it("can encode itself into a byte", () => {
			const flags = new FlagsRegister();
			flags.d = true;
			flags.z = true;
			flags.toByte().should.equal(0b00101010);
		});
	});
});
