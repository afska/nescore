import { MemoryChunk } from "../memory";
import { interrupts } from "./constants";
import constants from "../constants";
import createTestContext from "../helpers/createTestContext";
import { WithContext } from "../helpers";
import _ from "lodash";
const should = require("chai").Should();

const registersOf = (cpu) => _.mapValues(cpu.registers, (reg) => reg.value);

describe("CPU", () => {
	let cpu, memory;

	beforeEach(() => {
		({ cpu, memory } = createTestContext((context) => {
			// mock the whole memory map
			const memory = new MemoryChunk(constants.CPU_ADDRESSED_MEMORY);
			WithContext.apply(memory);
			context.cpu.memory = memory;

			// define sample program: NOP ; LDA #$05 ; STA $0201
			memory.write2BytesAt(interrupts.RESET.vector, 0x1234);
			[0xea, 0xa9, 0x05, 0x8d, 0x01, 0x02].forEach((byte, i) =>
				memory.writeAt(0x1234 + i, byte)
			);
		}));
	});

	it("initializes all variables", () => {
		cpu.pc.value.should.equal(0x1234);
		cpu.sp.value.should.equal(0xfd);
		cpu.flags.should.include({
			n: false,
			v: false,
			d: false,
			i: true,
			z: false,
			c: false
		});
		cpu.cycle.should.equal(7);

		registersOf(cpu).should.include({
			x: 0,
			y: 0,
			a: 0
		});
	});

	it("can run 3 simple operations", () => {
		let cycles;

		cycles = cpu.step();
		cycles.should.equal(2);
		cpu.pc.value.should.equal(0x1235);
		cpu.cycle.should.equal(9);

		cycles = cpu.step();
		cycles.should.equal(2);
		cpu.pc.value.should.equal(0x1237);
		cpu.cycle.should.equal(11);
		cpu.registers.a.value.should.equal(5);

		cycles = cpu.step();
		cycles.should.equal(4);
		cpu.pc.value.should.equal(0x123a);
		cpu.cycle.should.equal(15);
		memory.readAt(0x0201).should.equal(5);
	});

	_.values(interrupts).forEach((interrupt) => {
		it(`can handle ${interrupt.id} interrupts`, () => {
			cpu.step();
			cpu.pc.value.should.equal(0x1235);

			cpu.flags.i = false;
			memory.write2BytesAt(interrupt.vector, 0x3125);
			cpu.interrupt(interrupt);

			cpu.stack.pop().should.equal(0b00100000);
			cpu.stack.pop2Bytes().should.equal(0x1235);
			cpu.cycle.should.equal(16);
			cpu.flags.i.should.equal(true);
			cpu.pc.value.should.equal(0x3125);
		});
	});

	it("ignores IRQ interrupts when the I flag is set", () => {
		cpu.step();
		cpu.pc.value.should.equal(0x1235);

		cpu.flags.i = true;
		memory.write2BytesAt(interrupts.IRQ.vector, 0x3125);
		cpu.interrupt(interrupts.IRQ);

		cpu.sp.value.should.equal(0xfd);
		cpu.cycle.should.equal(9);
		cpu.flags.i.should.equal(true);
		cpu.pc.value.should.equal(0x1235);
	});
});
