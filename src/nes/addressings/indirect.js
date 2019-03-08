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
	getAddress: (context, address) => {
		return getIndirectAddress(context, address);
	},
	getValue
};

export const getIndirectAddress = (
	{ memory },
	address,
	transform = (it) => it
) => {
	const start = transform(address);
	const end = transform(start + 1);
	const low = memory.readAt(start);
	const high = memory.readAt(end);
	return Byte.to16Bit(high, low);
};
