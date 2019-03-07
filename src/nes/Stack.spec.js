import Stack from "./Stack";
import createTestContext from "./helpers/createTestContext";
const should = require("chai").Should();

describe("Stack", () => {
	let cpu, memory, stack;

	beforeEach(() => {
		({ cpu, memory } = createTestContext());
		stack = new Stack().loadContext({ cpu, memory });
		cpu.sp.value = 0xff;
	});

	it("can push and pop values", () => {
		stack.push(23);
		stack.push(24);
		stack.push(25);
		stack.pop().should.equal(25);
		stack.pop().should.equal(24);
		stack.pop().should.equal(23);
	});

	it("can push and pop 16-bit values", () => {
		stack.push2Bytes(0xfe30);
		stack.push2Bytes(0xcd45);
		stack.push2Bytes(0x1234);
		stack.pop2Bytes().should.equal(0x1234);
		stack.pop2Bytes().should.equal(0xcd45);
		stack.pop2Bytes().should.equal(0xfe30);
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

	it("ignores stack underflows", () => {
		memory.writeAt(0x0100, 32);
		stack.pop().should.equal(32);
		cpu.sp.value.should.equal(0);
	});

	it("ignores stack overflows", () => {
		cpu.sp.value = 0;
		stack.push(32);
		memory.readAt(0x0100).should.equal(32);
		cpu.sp.value.should.equal(0xff);
	});
});
