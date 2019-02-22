import getValue from "./_getValue";

/**
 * "Absolute,X" addressing mode.
 *
 * The parameter is an absolute memory address.
 * The final address is that number plus the contents of X.
 */
export default {
	id: "INDEXED_ABSOLUTE_X",
	parameterSize: 2,
	getAddress: ({ cpu }, address) => address + cpu.registers.x.value,
	getValue
};
