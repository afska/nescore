import createTestContext from "../helpers/createTestContext";
import _ from "lodash";
const should = require("chai").Should();

const NMI_VECTOR = 0xfffa;
const RESET_VECTOR = 0xfffc;
const IRQ_VECTOR = 0xfffe;
const registersOf = (cpu) => _.mapValues(cpu.registers, (reg) => reg.value);

describe("CPU", () => {
	let cpu, memory;

	beforeEach(() => {
		({ cpu, memory } = createTestContext((memory) => {
			// Sample program: NOP ; LDA #$05 ; STA $0201

			memory.write2BytesAt(RESET_VECTOR, 0x1234);
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
		cpu.step();
		cpu.pc.value.should.equal(0x1235);
		cpu.cycle.should.equal(9);

		cpu.step();
		cpu.pc.value.should.equal(0x1237);
		cpu.cycle.should.equal(11);
		cpu.registers.a.value.should.equal(5);

		cpu.step();
		cpu.pc.value.should.equal(0x123a);
		cpu.cycle.should.equal(15);
		memory.readAt(0x0201).should.equal(5);
	});

	[
		{ interrupt: "NMI", vector: NMI_VECTOR },
		{ interrupt: "RESET", vector: RESET_VECTOR },
		{ interrupt: "IRQ", vector: IRQ_VECTOR }
	].forEach(({ interrupt, vector }) => {
		it(`can handle ${interrupt} interrupts`, () => {
			cpu.step();
			cpu.pc.value.should.equal(0x1235);

			cpu.flags.i = false;
			memory.write2BytesAt(vector, 0x3125);
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
		memory.write2BytesAt(IRQ_VECTOR, 0x3125);
		cpu.interrupt("IRQ");

		cpu.sp.value.should.equal(0xfd);
		cpu.cycle.should.equal(9);
		cpu.flags.i.should.equal(true);
		cpu.pc.value.should.equal(0x1235);
	});
});
