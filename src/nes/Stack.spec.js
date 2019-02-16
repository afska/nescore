import Stack from "./Stack";
import { Register8Bit } from "./registers";
import { MemoryMap } from "./memory";
const should = require("chai").Should();

describe("Stack", () => {
	let cpu, memory, stack;

	beforeEach(() => {
		cpu = { sp: new Register8Bit(0xff) };
		memory = new MemoryMap();
		memory.loadContext({});
		stack = new Stack();
		stack.loadContext({ cpu, memory });
	});

	it("can push and pull values", () => {
		stack.push(23);
		stack.push(24);
		stack.push(25);
		stack.pop().should.equal(25);
		stack.pop().should.equal(24);
		stack.pop().should.equal(23);
	});
});
