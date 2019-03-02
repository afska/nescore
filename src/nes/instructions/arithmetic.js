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
			cpu.registers.a.value = result;
			const newValue = cpu.registers.a.value;

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
	 * Shifts all the bits of the value located in `address` one bit left.
	 * Bit 0 is set to 0 and bit 7 is placed in the C flag. The Z and N flags are updated too.
	 */
	{
		id: "ASL",
		execute: ({ cpu, memory }, address) => {
			const value = memory.readAt(address);
			const result = value << 1;
			const newValue = Byte.to8Bit(result);
			cpu.flags.updateZeroAndNegative(newValue);
			cpu.flags.updateCarry(result);
			memory.writeAt(address, newValue);
		}
	}
];

export default instructions();

