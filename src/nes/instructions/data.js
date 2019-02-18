const instructions = () => [
	/**
	 * Clear Carry Flag
	 *
	 * Clears the C flag.
	 */
	{
		id: "CLC",
		execute: CL_("c")
	},

	/**
	 * Clear Decimal Mode
	 *
	 * Clears the D flag.
	 */
	{
		id: "CLD",
		execute: CL_("d")
	},

	/**
	 * Clear Interrupt Disable
	 *
	 * Clears the I flag.
	 */
	{
		id: "CLI",
		execute: CL_("i")
	},

	/**
	 * Clear Overflow Flag
	 *
	 * Clears the V flag.
	 */
	{
		id: "CLV",
		execute: CL_("v")
	},

	/**
	 * Load Accumulator
	 *
	 * Loads `value` into A, updating the Z and N flags.
	 */
	{
		id: "LDA",
		execute: LD_("a")
	},

	/**
	 * Load X Register
	 *
	 * Loads `value` into X, updating the Z and N flags.
	 */
	{
		id: "LDX",
		execute: LD_("x")
	},

	/**
	 * Load Y Register
	 *
	 * Loads `value` into Y, updating the Z and N flags.
	 */
	{
		id: "LDY",
		execute: LD_("y")
	},

	/**
	 * Push Accumulator
	 *
	 * Pushes A into the stack.
	 */
	{
		id: "PHA",
		execute: PH_((cpu) => cpu.registers.a.value)
	},

	/**
	 * Push Processor Status
	 *
	 * Pushes the flags (as a byte) into the stack.
	 */
	{
		id: "PHP",
		execute: PH_((cpu) => cpu.flags.toByte())
	},

	/**
	 * Pull Accumulator
	 *
	 * Pulls a byte from the stack into A, updating the Z and N flags.
	 */
	{
		id: "PLA",
		execute: ({ cpu }) => {
			const value = cpu.stack.pop();
			cpu.registers.a.value = value;
			cpu.flags.updateZeroAndNegative(value);
		}
	},

	/**
	 * Pull Processor Status
	 *
	 * Pulls a byte from the stack into the flags.
	 */
	{
		id: "PLP",
		execute: ({ cpu }) => {
			cpu.flags.load(cpu.stack.pop());
		}
	},

	/**
	 * Set Carry Flag
	 *
	 * Sets the C flag.
	 */
	{
		id: "SEC",
		execute: SE_("c")
	},

	/**
	 * Set Decimal Flag
	 *
	 * Sets the D flag.
	 */
	{
		id: "SED",
		execute: SE_("d")
	},

	/**
	 * Set Interrupt Disable
	 *
	 * Sets the I flag.
	 */
	{
		id: "SEI",
		execute: SE_("i")
	},

	/**
	 * Store Accumulator
	 *
	 * Stores the contents of A into `address`.
	 */
	{
		id: "STA",
		execute: ST_("a")
	},

	/**
	 * Store X Register
	 *
	 * Stores the contents of X into `address`.
	 */
	{
		id: "STX",
		execute: ST_("x")
	},

	/**
	 * Store Y Register
	 *
	 * Stores the contents of Y into `address`.
	 */
	{
		id: "STY",
		execute: ST_("y")
	},

	/**
	 * Transfer Accumulator to X
	 *
	 * Copies A into X, updating the Z and N flags.
	 */
	{
		id: "TAX",
		execute: T__((cpu) => cpu.registers.a, (cpu) => cpu.registers.x)
	},

	/**
	 * Transfer Accumulator to Y
	 *
	 * Copies A into Y, updating the Z and N flags.
	 */
	{
		id: "TAY",
		execute: T__((cpu) => cpu.registers.a, (cpu) => cpu.registers.y)
	},

	/**
	 * Transfer Stack Pointer to X
	 *
	 * Copies SP into X, updating the Z and N flags.
	 */
	{
		id: "TSX",
		execute: T__((cpu) => cpu.sp, (cpu) => cpu.registers.x)
	},

	/**
	 * Transfer X to Accumulator
	 *
	 * Copies X into A, updating the Z and N flags.
	 */
	{
		id: "TXA",
		execute: T__((cpu) => cpu.registers.x, (cpu) => cpu.registers.a)
	},

	/**
	 * Transfer X to Stack Pointer
	 *
	 * Copies X into SP, updating the Z and N flags.
	 */
	{
		id: "TXS",
		execute: T__((cpu) => cpu.registers.x, (cpu) => cpu.sp)
	},

	/**
	 * Transfer Y to Accumulator
	 *
	 * Copies Y into A, updating the Z and N flags.
	 */
	{
		id: "TYA",
		execute: T__((cpu) => cpu.registers.y, (cpu) => cpu.registers.a)
	}
];

const SE_ = (flag) => {
	return ({ cpu }) => {
		cpu.flags[flag] = true;
	};
};

const CL_ = (flag) => {
	return ({ cpu }) => {
		cpu.flags[flag] = false;
	};
};

const LD_ = (register) => {
	return ({ cpu }, value) => {
		cpu.registers[register].value = value;
		cpu.flags.updateZeroAndNegative(value);
	};
};

const PH_ = (getValue) => {
	return ({ cpu }) => {
		cpu.stack.push(getValue(cpu));
	};
};

const ST_ = (register) => {
	return ({ cpu, memory }, address) => {
		const value = cpu.registers[register].value;
		memory.writeAt(address, value);
	};
};

const T__ = (getSourceRegister, getTargetRegister) => {
	return ({ cpu }) => {
		const value = getSourceRegister(cpu).value;
		getTargetRegister(cpu).value = value;
		cpu.flags.updateZeroAndNegative(value);
	};
};

export default instructions();
