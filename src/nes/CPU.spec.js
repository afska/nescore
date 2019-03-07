import createTestContext from "./helpers/createTestContext";
import _ from "lodash";
const should = require("chai").Should();

const RESET_VECTOR = 0xfffc;
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
			b1: true,
			b2: false,
			d: false,
			i: true,
			z: false,
			c: false
		});
		cpu.cycles.should.equal(7);

		registersOf(cpu).should.include({
			x: 0,
			y: 0,
			a: 0
		});
	});

	it("can run 3 simple operations", () => {
		cpu.step();
		cpu.cycles.should.equal(9);

		cpu.step();
		cpu.cycles.should.equal(11);
		cpu.registers.a.value.should.equal(5);

		cpu.step();
		cpu.cycles.should.equal(15);
		memory.readAt(0x0201).should.equal(5);
	});
});
