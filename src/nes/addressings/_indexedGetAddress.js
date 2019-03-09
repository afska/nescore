import { Byte } from "../helpers";

export default (register) => {
	return function({ cpu }, address, canTakeExtraCycles) {
		const newAddress = address + cpu.registers[register].value;
		const pageCrossed =
			Byte.highPartOf(address) !== Byte.highPartOf(newAddress);

		if (pageCrossed && canTakeExtraCycles) cpu.extraCycles++;

		return Byte.force16Bit(newAddress);
	};
};
