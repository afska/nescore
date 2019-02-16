import { MemoryChunk, MemoryMirror } from ".";
import { Buffer } from "buffer";
const should = require("chai").Should();

describe("memory", () => {
	describe("MemoryMirror", () => {
		let chunk, mirror;

		beforeEach(() => {
			chunk = new MemoryChunk(Buffer.alloc(5));
			mirror = new MemoryMirror(chunk, 29, 13);
		});

		it("can mirror write operations", () => {
			mirror.writeAt(5, 110);
			mirror.writeAt(6, 101);
			mirror.writeAt(12, 115);
			mirror.writeAt(3, 33);
			mirror.writeAt(4, 33);
			chunk
				.getMemory()
				.toString()
				.should.equal("nes!!");
		});

		it("can mirror read operations", () => {
			chunk.getMemory().write("nes!!");
			[5, 6, 12, 3, 4]
				.map((i) => mirror.readAt(i))
				.map((c) => String.fromCharCode(c))
				.join("")
				.should.equal("nes!!");
		});

		it("can return the size of the mirrored memory", () => {
			mirror.memorySize.should.equal(13);
		});

		it("can store the memory starting address", () => {
			mirror.memoryStartAddress.should.equal(29);
		});

		it("throws an exception when the address is out of bounds", () => {
			(() => mirror.readAt(13)).should.throw("Unreachable address: 0xd");
		});
	});
});
