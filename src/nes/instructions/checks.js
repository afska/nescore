const instructions = () => [
	/**
	 * Bit Test
	 *
	 * Tests if one or more bits are set in a `value`.
	 * The mask pattern in A is ANDed with the value to set or clear the Z flag,
	 * but the the result is not kept.
	 * Bits 7 and 6 of the value are copied into the N and V flags.
	 */
	{
		id: "BIT",
		needsValue: true,
		execute: ({ cpu }, value) => {
			const mask = cpu.registers.a.value;
			const result = value & mask;

			cpu.flags.updateZero(result);
			cpu.flags.updateNegative(value);
			cpu.flags.v = !!(value & 0b01000000);
		}
	},

	/**
	 * Compare
	 *
	 * Compares A with `value`, setting the flags:
	 * Z (if A = `value`), N (if bit 7 of A is set) and C (if A >= `value`).
	 */
	{
		id: "CMP",
		needsValue: true,
		execute: CP_("a")
	},

	/**
	 * Compare X Register
	 *
	 * Compares X with `value`, setting the flags:
	 * Z (if X = `value`), N (if bit 7 of X is set) and C (if X >= `value`).
	 */
	{
		id: "CPX",
		needsValue: true,
		execute: CP_("x")
	},

	/**
	 * Compare Y Register
	 *
	 * Compares Y with `value`, setting the flags:
	 * Z (if Y = `value`), N (if bit 7 of Y is set) and C (if Y >= `value`).
	 */
	{
		id: "CPY",
		needsValue: true,
		execute: CP_("y")
	}
];

const CP_ = (register) => {
	return ({ cpu }, value) => {
		const source = cpu.registers[register].value;
		cpu.flags.z = source === value;
		cpu.flags.updateNegative(source);
		cpu.flags.c = source >= value;
	};
};

export default instructions();
