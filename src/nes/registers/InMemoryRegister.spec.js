import { InMemoryRegister } from ".";
import { MemoryChunk } from "../memory";
const should = require("chai").Should();

describe("registers", () => {
	describe("InMemoryRegister", () => {
		let memory, register;

		beforeEach(() => {
			memory = new MemoryChunk(5);
			register = new InMemoryRegister(3)
				.addField("booleanBit2", 2)
				.addField("shortNumberBit5", 5, 2)
				.addField("longNumberBit4", 4, 4)
				.loadContext(memory);
		});

		it("allows reading subfields", () => {
			memory.writeAt(3, 0b01100100);

			register.booleanBit2.should.equal(true);
			register.shortNumberBit5.should.equal(0b11);
			register.longNumberBit4.should.equal(0b0110);
		});

		it("allows writing subfields", () => {
			register.booleanBit2 = true;
			memory.readAt(3).should.equal(0b00000100);
			register.longNumberBit4 = 0b1101;
			memory.readAt(3).should.equal(0b11010100);
			register.shortNumberBit5 = 0b01;
			memory.readAt(3).should.equal(0b10110100);
		});
	});
});
