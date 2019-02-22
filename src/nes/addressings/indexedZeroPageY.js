import getValue from "./_getValue";

/**
 * "Zero page,Y" addressing mode.
 *
 * The parameter is a single-byte memory address.
 * The final address is that number plus the contents of Y.
 */
export default {
	id: "INDEXED_ZERO_PAGE_Y",
	parameterSize: 1,
	getAddress: ({ cpu }, address) => address + cpu.registers.y.value,
	getValue
};
