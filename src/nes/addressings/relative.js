import { Byte } from "../helpers";
import getValue from "./_getValue";

/**
 * "Relative" addressing mode.
 *
 * The parameter is a signed relative offset from the following instruction.
 */
export default {
	id: "RELATIVE",
	parameterSize: 1,
	getAddress: ({ cpu }, offset, canTakeExtraCycles) => {
		const address = cpu.pc.value;
		const newAddress = address + Byte.toNumber(offset);
		const pageCrossed =
			Byte.highPartOf(address) !== Byte.highPartOf(newAddress);

		if (pageCrossed && canTakeExtraCycles) cpu.extraCycles += 2;

		return newAddress;
	},
	getValue
};
