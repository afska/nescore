import getValue from "./_getValue";

/**
 * "Zero page" addressing mode.
 *
 * The parameter is a single-byte memory address.
 * Only the first page (the first 256 bytes) of memory is accessible.
 */
export default {
	id: "ZERO_PAGE",
	parameterSize: 1,
	getAddress: (context, address) => address,
	getValue
};
