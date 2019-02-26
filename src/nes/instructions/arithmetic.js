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
		execute: ({ cpu }, value) => {
			const oldValue = cpu.registers.a.value;
			const result = oldValue + value + cpu.flags.c;
			cpu.registers.a.value = result;
			const newValue = cpu.registers.a.value;

			cpu.flags.updateZeroAndNegative(newValue);
			cpu.flags.c = Byte.hasOverflow(result);
			cpu.flags.v =
				(Byte.isPositive(oldValue) &&
					Byte.isPositive(value) &&
					Byte.isNegative(newValue)) ||
				(Byte.isNegative(oldValue) &&
					Byte.isNegative(value) &&
					Byte.isPositive(newValue));
		}
	}
];

export default instructions();

