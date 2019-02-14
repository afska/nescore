import { signedByte } from "../helpers";

const instructions = () => [
	/**
	 * Logical AND
	 *
	 * Performs a logical AND between A and `value`, storing the
	 * result in A and setting the Z (zero) and N (negative) flags.
	 */
	{
		id: "AND",
		execute: (cpu, value) => {
			cpu.registers.a.value &= value;
			if (value === 0) cpu.flags.z = true;
			if (signedByte.isNegative(value)) cpu.flags.n = true;
		}
	}
];

export default instructions();
