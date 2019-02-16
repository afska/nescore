import { MemoryChunk } from ".";
import { Buffer } from "buffer";
const should = require("chai").Should();

describe("memory", () => {
	describe("MemoryChunk", () => {
		let buffer, chunk;

		beforeEach(() => {
			buffer = Buffer.alloc(5);
			chunk = new MemoryChunk(buffer, 29);
		});

		it("can write and read bytes", () => {
			chunk.writeAt(2, 123);
			chunk.readAt(2).should.equal(123);
		});

		it("can return the memory buffer", () => {
			(chunk.getMemory() === buffer).should.ok;
		});

		it("can return the size of the buffer", () => {
			chunk.memorySize.should.equal(5);
		});

		it("can store the memory starting address", () => {
			chunk.memoryStartAddress.should.equal(29);
		});

		it("throws an exception when the address is out of bounds", () => {
			(() => chunk.writeAt(9, 123)).should.throw(
				`The value of "offset" is out of range. It must be >= 0 and <= 4. Received 9`
			);
		});
	});
});
