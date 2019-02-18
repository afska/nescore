import Stack from "./Stack";
import createTestContext from "./helpers/createTestContext";
const should = require("chai").Should();

describe("Stack", () => {
	let cpu, memory, stack;

	beforeEach(() => {
		({ cpu, memory } = createTestContext());
		stack = new Stack().loadContext({ cpu, memory });
	});

	it("can push and pop values", () => {
		stack.push(23);
		stack.push(24);
		stack.push(25);
		stack.pop().should.equal(25);
		stack.pop().should.equal(24);
		stack.pop().should.equal(23);
	});

	it("updates the memory and sp on push", () => {
		stack.push(23);
		memory.readAt(stack.startAddress + 0xff).should.equal(23);
		cpu.sp.value.should.equal(0xfe);
	});

	it("reads from the memory and updates sp on pop", () => {
		stack.push(23);
		memory.writeAt(stack.startAddress + 0xff, 30);
		stack.pop().should.equal(30);
		cpu.sp.value.should.equal(0xff);
	});

	it("handles stack underflows", () => {
		(() => stack.pop()).should.throw("Stack underflow.");
	});

	it("handles stack overflows", () => {
		(() => {
			for (let i = 0; i < 256; i++) stack.push(1);
		}).should.throw("Stack overflow.");
	});
});
