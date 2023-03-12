import { getIndirectAddress } from "../cpu/addressings/indirect";
import { Byte } from "../helpers";
import _ from "lodash";

const hex = (value, length) =>
	_.padStart(value.toString(16).toUpperCase(), length, "0");

/** A logger that resembles Nintendulator's logs format, to use with nestest (a test ROM). */
export default class NESTestLogger {
	constructor() {
		this.lastLog = null;
	}

	/** Logs a CPU instruction. All the information is in `request`. */
	log(request) {
		const { context, pc, operation, initialArgument, finalArgument } = request;

		try {
			context.inDebugMode(() => {
				const { cpu } = context;
				const memory = cpu.memory;

				const cycle = (value, length) => _.padStart(value.toString(), length);
				const section = (string, length) =>
					_.padEnd(string.substr(0, length), length);
				const hexArgument = (value) => {
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

					const $initialArgument = hexArgument(initialArgument, 2);
					const $finalArgument = hexArgument(finalArgument, 2);
					let finalAddress = null;

					try {
						finalAddress = operation.addressing.getAddress(
							context,
							initialArgument
						);
					} catch (e) {}

					switch (operation.addressing.id) {
						case "IMPLICIT":
							return "";
						case "IMMEDIATE":
							return `#$${$finalArgument}`;
						case "ABSOLUTE":
							let $address = `$${$initialArgument}`;
							if (_.includes(instructionsWithValue, operation.instruction.id))
								$address += ` = ${hex(memory.readAt(finalAddress), 2)}`;
							return $address;
						case "ZERO_PAGE":
							return `$${$initialArgument} = ${hex(
								memory.readAt(finalAddress),
								2
							)}`;
						case "INDEXED_ABSOLUTE_X":
						case "INDEXED_ZERO_PAGE_X":
							return `$${$initialArgument},X @ ${hexArgument(
								finalAddress
							)} = ${hex(memory.readAt(finalAddress), 2)}`;
						case "INDEXED_ABSOLUTE_Y":
						case "INDEXED_ZERO_PAGE_Y":
							return `$${$initialArgument},Y @ ${hexArgument(
								finalAddress
							)} = ${hex(memory.readAt(finalAddress), 2)}`;
						case "INDIRECT":
							return `($${$initialArgument}) = ${hex(finalAddress, 4)}`;
						case "INDEXED_INDIRECT_X":
							return `($${$initialArgument},X) @ ${hex(
								Byte.force8Bit(initialArgument + cpu.registers.x.value),
								2
							)} = ${hex(finalAddress, 4)} = ${hex(
								memory.readAt(finalAddress),
								2
							)}`;
						case "INDEXED_INDIRECT_Y":
							return `($${$initialArgument}),Y = ${hex(
								getIndirectAddress(context, initialArgument),
								4
							)} @ ${hex(finalAddress, 4)} = ${hex(
								memory.readAt(finalAddress),
								2
							)}`;
						case "ACCUMULATOR":
							return "A";
						default:
							return `$${$finalArgument}`;
					}
				};

				const $counter = section(hex(pc, 4), 6);

				const $operation = hex(operation.id, 2);
				let $arguments = " ";
				if (operation.addressing.parameterSize > 0) {
					$arguments +=
						operation.addressing.parameterSize === 2
							? hex(Byte.lowPartOf(initialArgument), 2) +
							  " " +
							  hex(Byte.highPartOf(initialArgument), 2)
							: hex(initialArgument, 2);
				}
				const $commandHex = section($operation + $arguments, 10);

				const $assembly = section(
					operation.instruction.id + " " + formatParameter(),
					32
				);

				const $registers =
					["a", "x", "y"]
						.map((register) => {
							return (
								register.toUpperCase() +
								":" +
								hex(cpu.registers[register].value, 2)
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
			});
		} catch (e) {
			console.error(e);
		}
	}
}
