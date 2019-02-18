/**
 * "Absolute,Y" addressing mode.
 *
 * The parameter is an absolute memory address, plus the contents of Y.
 */
export default {
	id: "INDEXED_ABSOLUTE_Y",
	parameterSize: 2,
	getParameter: ({ cpu }, address) => address + cpu.registers.y.value
};
