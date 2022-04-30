import RewiredMemoryChunk from "./RewiredMemoryChunk";
const should = require("chai").Should();

describe("memory", () => {
	describe("RewiredMemoryChunk", () => {
		let rewiredChunk;

		beforeEach(() => {
			rewiredChunk = new RewiredMemoryChunk(0x20, {
				0x10: 0x00,
				0x14: 0x04,
				0x18: 0x08,
				0x1c: 0x0c
			});
		});

		it("read and write bytes normally", () => {
			rewiredChunk.writeAt(0x02, 123);
			rewiredChunk.readAt(0x02).should.equal(123);
		});

		it("translates read operations using mappings", () => {
			rewiredChunk.writeAt(0x04, 123);
			rewiredChunk.readAt(0x14).should.equal(123);
		});

		it("translates write operations using mappings", () => {
			rewiredChunk.writeAt(0x18, 123);
			rewiredChunk.readAt(0x08).should.equal(123);
		});
	});
});
