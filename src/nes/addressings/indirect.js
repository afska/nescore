import { Byte } from "../helpers";
import getValue from "./_getValue";

/**
 * "Indirect" addressing mode.
 *
 * The parameter is an absolute memory address to look up another address.
 * The byte readed from memory gives the least significant byte of the final
 * address, and the following byte gives the most significant byte.
 */
export default {
	id: "INDIRECT",
	parameterSize: 2,
	getAddress: ({ memory }, address) => {
		const leastSignificantByte = memory.readAt(address);
		const mostSignificantByte = memory.readAt(address + 1);
		return Byte.to16BitNumber(mostSignificantByte, leastSignificantByte);
	},
	getValue
};
