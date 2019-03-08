import { Byte } from "../helpers";
import { getIndirectAddress } from "./indirect";
import indexedGetAddress from "./_indexedGetAddress";
import getValue from "./_getValue";

const indexedGetAddressY = indexedGetAddress("y");

/**
 * "Indirect indexed" addressing mode.
 *
 * The parameter is a single-byte memory address, which is dereferenced.
 * Then, the contents of Y is added to get the final address.
 */
export default {
	id: "INDEXED_INDIRECT_Y",
	parameterSize: 1,
	getAddress: (context, address, canTakeExtraCycles) => {
		return Byte.force16Bit(
			indexedGetAddressY(
				context,
				getIndirectAddress(context, address),
				canTakeExtraCycles
			)
		);
	},
	getValue
};
