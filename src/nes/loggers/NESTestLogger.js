import { getIndirectAddress } from "../cpu/addressings/indirect";
import { Byte } from "../helpers";
import _ from "lodash";

const hex = (value, length) =>
	_.padStart(value.toString(16).toUpperCase(), length, "0");

export default class NESTestLogger {
	constructor(withConsole = false) {
		this.lastLog = null;
		this.withConsole = withConsole;
	}

	log(request) {
		const {
			context,
			pc,
			operation,
			initialParameter,
			finalParameter
		} = request;

		const { cpu, memory } = context;

		const cycle = (value, length) => _.padStart(value.toString(), length);
		const section = (string, length) =>
			_.padEnd(string.substr(0, length), length);
		const hexParameter = (value) => {
			if (operation.addressing.parameterSize === 0) return "";

			return operation.addressing.parameterSize === 2
				? hex(value, 4)
				: hex(value, 2);
		};
		const formatParameter = () => {
			const instructionsWithValue = [
				"STA",
				"STX",
				"STY",
				"LDA",
				"LDX",
				"LDY",
				"BIT",
				"ORA",
				"AND",
				"EOR",
				"ADC",
				"SBC",
				"CMP",
				"CPX",
				"CPY",
				"LSR",
				"ASL",
				"ROR",
				"ROL",
				"INC",
				"DEC"
			];

			const $initialParameter = hexParameter(initialParameter, 2);
			const $finalParameter = hexParameter(finalParameter, 2);
			let finalAddress = null;

			try {
				finalAddress = operation.addressing.getAddress(
					context,
					initialParameter
				);
			} catch (e) {}

			switch (operation.addressing.id) {
				case "IMPLICIT":
					return "";
				case "IMMEDIATE":
					return `#$${$finalParameter}`;
				case "ABSOLUTE":
					let $address = `$${$initialParameter}`;
					if (_.includes(instructionsWithValue, operation.instruction.id))
						$address += ` = ${hex(memory.readAt(finalAddress), 2)}`;
					return $address;
				case "ZERO_PAGE":
					return `$${$initialParameter} = ${hex(
						memory.readAt(finalAddress),
						2
					)}`;
				case "INDEXED_ABSOLUTE_X":
				case "INDEXED_ZERO_PAGE_X":
					return `$${$initialParameter},X @ ${hexParameter(
						finalAddress
					)} = ${hex(memory.readAt(finalAddress), 2)}`;
				case "INDEXED_ABSOLUTE_Y":
				case "INDEXED_ZERO_PAGE_Y":
					return `$${$initialParameter},Y @ ${hexParameter(
						finalAddress
					)} = ${hex(memory.readAt(finalAddress), 2)}`;
				case "INDIRECT":
					return `($${$initialParameter}) = ${hex(finalAddress, 4)}`;
				case "INDEXED_INDIRECT_X":
					return `($${$initialParameter},X) @ ${hex(
						Byte.force8Bit(initialParameter + cpu.registers.x.value),
						2
					)} = ${hex(finalAddress, 4)} = ${hex(
						memory.readAt(finalAddress),
						2
					)}`;
				case "INDEXED_INDIRECT_Y":
					return `($${$initialParameter}),Y = ${hex(
						getIndirectAddress(context, initialParameter, Byte.force8Bit),
						4
					)} @ ${hex(finalAddress, 4)} = ${hex(
						memory.readAt(finalAddress),
						2
					)}`;
				case "ACCUMULATOR":
					return "A";
				default:
					return `$${$finalParameter}`;
			}
		};

		const $counter = section(hex(pc, 4), 6);

		const $operation = hex(operation.id, 2);
		let $parameters = " ";
		if (operation.addressing.parameterSize > 0) {
			$parameters +=
				operation.addressing.parameterSize === 2
					? hex(Byte.lowPartOf(initialParameter), 2) +
					  " " +
					  hex(Byte.highPartOf(initialParameter), 2)
					: hex(initialParameter, 2);
		}
		const $commandHex = section($operation + $parameters, 10);

		const $assembly = section(
			operation.instruction.id + " " + formatParameter(),
			32
		);

		const $registers =
			["a", "x", "y"]
				.map((register) => {
					return (
						register.toUpperCase() + ":" + hex(cpu.registers[register].value, 2)
					);
				})
				.join(" ") +
			" P:" +
			hex(cpu.flags.toByte(), 2) +
			" SP:" +
			hex(cpu.sp.value, 2);

		const $ppuCycle = "PPU:" + cycle(0, 3) + "," + cycle(1, 3);
		const $cpuCycle = "CYC:" + cpu.cycle;
		const $status = `${$registers} ${$ppuCycle} ${$cpuCycle}`;

		this.lastLog = $counter + $commandHex + $assembly + $status;
		if (this.withConsole) console.log(this.lastLog);
	}
}
