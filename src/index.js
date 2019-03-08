import NES from "./nes/NES";
import { Buffer } from "buffer";
import "./gui";
import { Byte } from "./nes/helpers";
import _ from "lodash";

const hex = (value, length) =>
	_.padStart(value.toString(16).toUpperCase(), length, "0");

const nesTestLogger = {
	log: (request) => {
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
			const instructionsWithValue = ["STA", "STX", "STY", "LDA", "LDX", "LDY"];
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
					return `$${initialParameter},X`;
				case "INDEXED_ABSOLUTE_Y":
				case "INDEXED_ZERO_PAGE_Y":
					return `$${$initialParameter},Y`;
				case "INDIRECT":
					return `($${$initialParameter})`;
				case "INDEXED_INDIRECT_X":
					return `($${$initialParameter},X)`;
				case "INDEXED_INDIRECT_Y":
					return `($${$initialParameter}),Y`;
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
		const $cpuCycle = "CYC:" + cpu.cycles;
		const $status = `${$registers} ${$ppuCycle} ${$cpuCycle}`;

		window.lastLog = $counter + $commandHex + $assembly + $status;
	}
};

const DEMO = async () => {
	const response = await fetch("testroms/nestest.nes");
	const arrayBuffer = await response.arrayBuffer();
	const bytes = Buffer.from(arrayBuffer);

	window.bytes = bytes;
	window.nes = new NES();

	window.nes.load(bytes, nesTestLogger);
	window.nes.cpu.pc.value = 0xc000;

	const logResponse = await fetch("testroms/nestest.log");
	const logText = await logResponse.text();
	const logLines = logText.split(/\n|\r\n|\r/);

	// DEBUG:
	// window.nes.cpu.pc.value = 0xce34;
	// window.nes.cpu.registers.a.value = 0x69;
	// window.nes.cpu.registers.x.value = 0x80;
	// window.nes.cpu.registers.y.value = 0x01;
	// window.nes.cpu.flags.load(0x27);
	// window.nes.cpu.sp.value = 0x80;
	// window.nes.cpu.cycles = 2013;

	const withoutPpu = (line) => line.replace(/PPU: *\d+, *\d+ CYC:/, "CYC:");
	let line = 0;
	window.getDiff = () => {
		window.nes.step();
		const diff = {
			actual: withoutPpu(window.lastLog),
			expected: withoutPpu(logLines[line])
		};
		line++;
		return diff;
	};
};

DEMO();
