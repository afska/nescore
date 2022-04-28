import { createTestContextForMemory } from "../helpers/createTestContext";
const should = require("chai").Should();

const ADDRESS = 0x4016;
const A_LOT = 30;

describe("I/O registers interaction", () => {
	describe("Controller port 1", () => {
		let controllers, memory;

		beforeEach(() => {
			({ controllers, memory } = createTestContextForMemory());
		});

		it("can read controller's input, one button at time", () => {
			controllers[0].update("BUTTON_DOWN", true);
			controllers[0].update("BUTTON_START", true);

			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(1);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(1);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(0);
		});

		it("returns 1 after 8 button reads", () => {
			for (let i = 0; i < 8; i++) memory.readAt(ADDRESS).should.equal(0);
			for (let i = 0; i < A_LOT; i++) memory.readAt(ADDRESS).should.equal(1);
		});

		it("resets the cursor to A when writing 1 to the strobe flag", () => {
			controllers[0].update("BUTTON_A", true);
			controllers[0].update("BUTTON_DOWN", true);
			controllers[0].update("BUTTON_START", true);

			memory.readAt(ADDRESS).should.equal(1);
			memory.readAt(ADDRESS).should.equal(0);

			memory.writeAt(ADDRESS, 1);
			for (let i = 0; i < A_LOT; i++) memory.readAt(ADDRESS).should.equal(1);

			controllers[0].update("BUTTON_A", false);
			for (let i = 0; i < A_LOT; i++) memory.readAt(ADDRESS).should.equal(0);

			controllers[0].update("BUTTON_A", true);
			memory.writeAt(ADDRESS, 0);

			memory.readAt(ADDRESS).should.equal(1);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(1);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(1);
			memory.readAt(ADDRESS).should.equal(0);
			memory.readAt(ADDRESS).should.equal(0);
		});
	});
});
