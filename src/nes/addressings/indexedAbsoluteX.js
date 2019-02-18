/**
 * "Absolute,X" addressing mode.
 *
 * The parameter is an absolute memory address, plus the contents of X.
 */
export default {
	id: "INDEXED_ABSOLUTE_X",
	parameterSize: 2,
	getParameter: ({ cpu }, address) => address + cpu.registers.x.value
};
