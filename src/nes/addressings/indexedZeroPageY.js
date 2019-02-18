/**
 * "Zero page,Y" addressing mode.
 *
 * The parameter is a single-byte memory address, plus the contents of Y.
 */
export default {
	id: "INDEXED_ZERO_PAGE_Y",
	parameterSize: 1,
	getParameter: ({ cpu }, address) => address + cpu.registers.y.value
};
