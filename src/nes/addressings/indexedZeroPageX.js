/**
 * "Zero page,X" addressing mode.
 *
 * The parameter is a single-byte memory address, plus the contents of X.
 */
export default {
	id: "INDEXED_ZERO_PAGE_X",
	parameterSize: 1,
	getParameter: ({ cpu }, address) => address + cpu.registers.x.value
};
