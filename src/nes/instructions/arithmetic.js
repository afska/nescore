import { Byte } from "../helpers";

const instructions = () => [
	/**
	 * Add with Carry
	 *
	 * Adds the contents of `value` to A together with the carry bit, updating the Z and N flags.
	 * The C and V flags are set in case of unsigned and signed overflow respectively.
	 * Signed overflow occurs when `Positive + Positive = Negative` or `Negative + Negative = Positive`.
	 */
	{
		id: "ADC",
		needsValue: true,
		execute: ({ cpu }, value) => {
			const oldValue = cpu.registers.a.value;
			const result = oldValue + value + cpu.flags.c;
			const newValue = Byte.to8Bit(result);

			cpu.registers.a.value = newValue;
			cpu.flags.updateZeroAndNegative(newValue);
			cpu.flags.updateCarry(result);
			cpu.flags.v =
				(Byte.isPositive(oldValue) &&
					Byte.isPositive(value) &&
					Byte.isNegative(newValue)) ||
				(Byte.isNegative(oldValue) &&
					Byte.isNegative(value) &&
					Byte.isPositive(newValue));
		}
	},

	/**
	 * Arithmetic Shift Left
	 *
	 * Shifts all the bits of the value held at `address` one bit left.
	 * Bit 0 is set to 0 and bit 7 is placed in the C flag. The Z and N flags are updated too.
	 */
	{
		id: "ASL",
		execute: ({ cpu, memory }, address) => {
			const value = memory.readAt(address);
			const result = value << 1;
			const newValue = Byte.to8Bit(result);

			memory.writeAt(address, newValue);
			cpu.flags.updateZeroAndNegative(newValue);
			cpu.flags.updateCarry(result);
		}
	},

	/**
	 * Decrement Memory
	 *
	 * Substracts one from the value held at `address`, setting the Z and N flags.
	 */
	{
		id: "DEC",
		execute: __C((one) => one - 1)
	},

	/**
	 * Decrement X Register
	 *
	 * Substracts one from X, setting the Z and N flags.
	 */
	{
		id: "DEX",
		execute: DE_("x")
	},

	/**
	 * Decrement Y Register
	 *
	 * Substracts one from Y, setting the Z and N flags.
	 */
	{
		id: "DEY",
		execute: DE_("y")
	},

	/**
	 * Increment Memory
	 *
	 * Adds one to the value held at `address`, setting the Z and N flags.
	 */
	{
		id: "INC",
		execute: __C((one) => one + 1)
	},

	/**
	 * Increment X Register
	 *
	 * Adds one to X, setting the Z and N flags.
	 */
	{
		id: "INX",
		execute: IN_("x")
	},

	/**
	 * Increment Y Register
	 *
	 * Adds one to Y, setting the Z and N flags.
	 */
	{
		id: "INY",
		execute: IN_("y")
	}
];

const __C = (operator) => {
	return ({ cpu, memory }, address) => {
		const value = memory.readAt(address);
		const newValue = Byte.to8Bit(operator(value));

		cpu.flags.updateZeroAndNegative(newValue);
		memory.writeAt(address, newValue);
	};
};

const DE_ = (registerName) => {
	return ({ cpu }) => {
		const register = cpu.registers[registerName];
		register.decrement();
		cpu.flags.updateZeroAndNegative(register.value);
	};
};

const IN_ = (registerName) => {
	return ({ cpu }) => {
		const register = cpu.registers[registerName];
		register.increment();
		cpu.flags.updateZeroAndNegative(register.value);
	};
};

export default instructions();
