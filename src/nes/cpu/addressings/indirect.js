import { Byte } from "../../helpers";
import getValue from "./_getValue";

/**
 * "Indirect" addressing mode.
 *
 * The parameter is an absolute memory address to look up another address.
 * The byte read from memory gives the least significant byte of the final
 * address, and the following byte gives the most significant byte.
 *
 * This addressing mode has a bug:
 * If `address` falls on a page boundary ($xxFF), it fetches the least significant byte from
 * $xxFF as expected, but takes the most significant byte from $xx00.
 */
export default {
	id: "INDIRECT",
	parameterSize: 2,
	getAddress: ({ cpu }, address) => {
		const msb = Byte.highPartOf(address);
		const lsb = Byte.lowPartOf(address);
		const low = cpu.memory.readAt(address);
		const high = cpu.memory.readAt(
			lsb === 0xff ? Byte.to16Bit(msb, 0x00) : address + 1
		);

		return Byte.to16Bit(high, low);
	},
	getValue
};

export const getIndirectAddress = ({ cpu }, address) => {
	const start = Byte.force8Bit(address);
	const end = Byte.force8Bit(start + 1);
	const low = cpu.memory.readAt(start);
	const high = cpu.memory.readAt(end);

	return Byte.to16Bit(high, low);
};
