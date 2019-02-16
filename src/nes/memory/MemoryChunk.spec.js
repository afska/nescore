import { MemoryChunk } from ".";
import { Buffer } from "buffer";
const should = require("chai").Should();

describe("memory", () => {
	describe("MemoryChunk", () => {
		let chunk;

		beforeEach(() => {
			chunk = new MemoryChunk(Buffer.alloc(5), 29);
		});

		it("can write and read bytes", () => {
			chunk.writeAt(2, 123);
			chunk.readAt(2).should.eql(123);
		});

		it("can return the size of the buffer", () => {
			chunk.memorySize.should.eql(5);
		});

		it("can store the memory starting address", () => {
			chunk.memoryStartAddress.should.eql(29);
		});

		it("throws an exception when the address is out of bounds", () => {
			(() => chunk.writeAt(9, 123)).should.throw(
				`The value of "offset" is out of range. It must be >= 0 and <= 4. Received 9`
			);
		});
	});
});
