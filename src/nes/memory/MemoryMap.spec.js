import { MemoryMap, MemoryChunk } from ".";
import { Register8Bit } from "../registers";
const should = require("chai").Should();

const MAPPER_START_ADDRESS = 0x4020;
const MAPPER_SIZE = 5;

describe("memory", () => {
	describe("MemoryMap", () => {
		let mapper, memory;

		beforeEach(() => {
			mapper = new MemoryChunk(MAPPER_SIZE, MAPPER_START_ADDRESS);
			memory = new MemoryMap().loadContext({ mapper });
		});

		it("can write in the right chunk", () => {
			memory.writeAt(MAPPER_START_ADDRESS + 1, 123);
			mapper.readAt(1).should.equal(123);
		});

		it("can accept a register as address", () => {
			const register = new Register8Bit(123);
			memory.writeAt(register, 250);
			register.value.should.equal(250);
		});

		it("can read from the right chunk", () => {
			mapper.writeAt(1, 123);
			memory.readAt(MAPPER_START_ADDRESS + 1).should.equal(123);
		});

		it("can read and write RAM's mirror", () => {
			memory.writeAt(0, 129);
			memory.readAt(0x1800).should.equal(129);
			memory.writeAt(0x1801, 201);
			memory.readAt(1).should.equal(201);
		});

		it("throws an exception when the address is out of bounds", () => {
			(() => memory.readAt(MAPPER_START_ADDRESS + MAPPER_SIZE)).should.throw(
				"Unreachable address: 0x4025."
			);
		});
	});
});
