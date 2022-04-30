import { MemoryChunk, MemoryMirror } from ".";
const should = require("chai").Should();

describe("memory", () => {
	describe("MemoryMirror", () => {
		let chunk, mirror;

		beforeEach(() => {
			chunk = new MemoryChunk(5);
			mirror = new MemoryMirror(chunk, 13);
		});

		it("can mirror write operations", () => {
			mirror.writeAt(5, 104);
			mirror.writeAt(6, 101);
			mirror.writeAt(12, 121);
			mirror.writeAt(3, 33);
			mirror.writeAt(4, 45);
			chunk.bytes.toString().should.equal("hey!-");
		});

		it("can mirror read operations", () => {
			chunk.bytes.write("hey!-");
			[5, 6, 12, 3, 4]
				.map((i) => mirror.readAt(i))
				.map((c) => String.fromCharCode(c))
				.join("")
				.should.equal("hey!-");
		});

		it("can read and write numbers in Little Endian", () => {
			mirror.writeAt(0, 0x20);
			mirror.writeAt(1, 0xff);
			mirror.write2BytesAt(2, 0xfe30);

			mirror.readBytesAt(0, 1).should.equal(0x20);
			mirror.readBytesAt(1, 1).should.equal(0xff);
			mirror.readBytesAt(0, 2).should.equal(0xff20);
			mirror.read2BytesAt(0).should.equal(0xff20);
			mirror.read2BytesAt(2).should.equal(0xfe30);
		});

		it("can return the size of the mirrored memory", () => {
			mirror.memorySize.should.equal(13);
		});

		it("supports the startAt and mirroredSize parameters", () => {
			const mirror = new MemoryMirror(chunk, 13, 1, 3);
			chunk.bytes.write("BYTES");
			//                       012
			//                       345 <<
			mirror.readAt(5).should.equal("E".charCodeAt(0));
		});

		it("throws an exception when the address is out of bounds", () => {
			(() => mirror.readAt(13)).should.throw("Unreachable address: 0xd");
		});
	});
});
