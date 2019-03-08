import { Register8Bit } from ".";
const should = require("chai").Should();

describe("registers", () => {
	describe("Register8Bit", () => {
		it("allows initial values", () => {
			const register = new Register8Bit(5);
			register.value.should.equal(5);
			register.value = 8;
			register.value.should.equal(8);
			register.reset();
			register.value.should.equal(5);
		});

		it("handles overflows and underflows correctly", () => {
			const register = new Register8Bit(250);
			register.value += 7;
			register.value.should.equal(1);

			register.value = 0;
			register.value--;
			register.value.should.equal(255);
		});

		it("can increment the value", () => {
			const register = new Register8Bit(250);
			register.increment();
			register.value.should.equal(251);
		});

		it("can decrement the value", () => {
			const register = new Register8Bit(250);
			register.decrement();
			register.value.should.equal(249);
		});
	});
});
