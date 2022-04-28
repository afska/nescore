import createTestContext from "../helpers/createTestContext";
const should = require("chai").Should();

const PRIMARY_ADDRESS = 0x4016;
const ADDRESS = 0x4017;
const A_LOT = 30;

describe("I/O registers interaction", () => {
	describe("Controller port 2", () => {
		let controllers, memory;

		beforeEach(() => {
			({ controllers, memory } = createTestContext());
		});

		it("resets the cursor to A when writing 1 to the strobe flag of the primary controller", () => {
			controllers[1].update("BUTTON_A", true);
			controllers[1].update("BUTTON_DOWN", true);
			controllers[1].update("BUTTON_START", true);

			memory.readAt(ADDRESS).should.equal(1);
			memory.readAt(ADDRESS).should.equal(0);

			memory.writeAt(PRIMARY_ADDRESS, 1);
			for (let i = 0; i < A_LOT; i++) memory.readAt(ADDRESS).should.equal(1);

			controllers[1].update("BUTTON_A", false);
			for (let i = 0; i < A_LOT; i++) memory.readAt(ADDRESS).should.equal(0);

			controllers[1].update("BUTTON_A", true);
			memory.writeAt(PRIMARY_ADDRESS, 0);

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
