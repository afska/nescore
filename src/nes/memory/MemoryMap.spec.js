import { MemoryMap, MemoryChunk } from ".";
const should = require("chai").Should();

const CARTRIDGE_START_ADDRESS = 0x4020;
const CARTRIDGE_SIZE = 5;

describe("memory", () => {
	describe("MemoryMap", () => {
		let cartridge, memory;

		beforeEach(() => {
			cartridge = new MemoryChunk(
				Buffer.alloc(CARTRIDGE_SIZE),
				CARTRIDGE_START_ADDRESS
			);
			memory = new MemoryMap();
			memory.loadContext({ cartridge });
		});

		it("can write in the right chunk", () => {
			memory.writeAt(CARTRIDGE_START_ADDRESS + 1, 123);
			cartridge.readAt(1).should.equal(123);
		});

		it("can read from the right chunk", () => {
			cartridge.writeAt(1, 123);
			memory.readAt(CARTRIDGE_START_ADDRESS + 1).should.equal(123);
		});

		it("can read and write RAM's mirror", () => {
			memory.writeAt(0, 129);
			memory.readAt(0x1800).should.equal(129);
			memory.writeAt(0x1801, 201);
			memory.readAt(1).should.equal(201);
		});

		it("throws an exception when the address is out of bounds", () => {
			(() =>
				memory.readAt(CARTRIDGE_START_ADDRESS + CARTRIDGE_SIZE)).should.throw(
				"Unreachable address: 0x4025."
			);
		});
	});
});
