import { Register8Bit } from "./registers";
import { createTestContextForCPUMemoryMap } from "../helpers/createTestContext";
import _ from "lodash";
const should = require("chai").Should();

const MAPPER_START_ADDRESS = 0x4020;
const MAPPER_SIZE = 0xbfe0;
const KB = 1024;

describe("memory", () => {
	describe("CPUMemoryMap", () => {
		let ppu, mapper, memory;

		beforeEach(() => {
			({ ppu, mapper, memory } = createTestContextForCPUMemoryMap());
		});

		it("stores the start address of each chunk", () => {
			_.last(memory.chunks).$memoryStartAddress.should.equal(
				MAPPER_START_ADDRESS
			);
		});

		it("stores the memory size", () => {
			memory.memorySize.should.equal(64 * KB);
		});

		it("can write in the right chunk", () => {
			memory.writeAt(MAPPER_START_ADDRESS + 1, 123);
			mapper.readAt(1).should.equal(123);
		});

		it("can read from the right chunk", () => {
			mapper.writeAt(1, 123);
			memory.readAt(MAPPER_START_ADDRESS + 1).should.equal(123);
		});

		it("can accept a register as address", () => {
			const register = new Register8Bit(123);
			memory.writeAt(register, 250);
			register.value.should.equal(250);
		});

		it("can read and write RAM's mirror", () => {
			memory.writeAt(0, 129);
			memory.readAt(0x1800).should.equal(129);
			memory.writeAt(0x1801, 201);
			memory.readAt(1).should.equal(201);
		});

		it("can read and write numbers in Little Endian", () => {
			memory.writeAt(0, 0x20);
			memory.writeAt(1, 0xff);
			memory.write2BytesAt(2, 0xfe30);

			memory.readBytesAt(0, 1).should.equal(0x20);
			memory.readBytesAt(1, 1).should.equal(0xff);
			memory.readBytesAt(0, 2).should.equal(0xff20);
			memory.read2BytesAt(0).should.equal(0xff20);
			memory.read2BytesAt(2).should.equal(0xfe30);
		});

		it("can write the PPUMask register", () => {
			ppu.registers.ppuMask.showBackground.should.equal(0);
			ppu.registers.ppuMask.emphasizeRed.should.equal(0);
			ppu.registers.ppuMask.showSprites.should.equal(0);
			ppu.registers.ppuMask.emphasizeGreen.should.equal(0);

			memory.writeAt(0x2001, 0b00101000);

			ppu.registers.ppuMask.showBackground.should.equal(1);
			ppu.registers.ppuMask.emphasizeRed.should.equal(1);
			ppu.registers.ppuMask.showSprites.should.equal(0);
			ppu.registers.ppuMask.emphasizeGreen.should.equal(0);
		});

		it("can read the PPUStatus register", () => {
			memory.readAt(0x2002).should.equal(0);

			ppu.registers.ppuStatus.spriteOverflow = 1;
			ppu.registers.ppuStatus.sprite0Hit = 1;

			memory.readAt(0x2002).should.equal(0b01100000);
		});

		it("throws an exception when the address is out of bounds", () => {
			(() => memory.readAt(MAPPER_START_ADDRESS + MAPPER_SIZE)).should.throw(
				"Unreachable address: 0x10000."
			);
		});
	});
});
