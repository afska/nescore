import InMemoryRegister from "./InMemoryRegister";
import { WithCompositeMemory } from "../memory";
const should = require("chai").Should();

describe("registers", () => {
	describe("InMemoryRegister", () => {
		let memory, register;

		beforeEach(() => {
			memory = WithCompositeMemory.createSegment([
				new InMemoryRegister(), // byte 0
				new InMemoryRegister(), // byte 1
				new InMemoryRegister(), // byte 2
				(register = new InMemoryRegister() // byte 3
					.addField("booleanBit2", 2)
					.addReadOnlyField("shortNumberBit5", 5, 2)
					.addField("longNumberBit4", 4, 4))
			]);
		});

		it("allows reading subfields", () => {
			memory.writeAt(3, 0b01100100);

			register.booleanBit2.should.equal(1);
			register.shortNumberBit5.should.equal(0b11);
			register.longNumberBit4.should.equal(0b0110);
		});

		it("allows writing subfields", () => {
			register.booleanBit2 = 1;
			memory.readAt(3).should.equal(0b00000100);
			register.longNumberBit4 = 0b1101;
			memory.readAt(3).should.equal(0b11010100);
		});
	});
});
