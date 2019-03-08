import NES from "./nes/NES";
import { Buffer } from "buffer";
import "./gui";
import { Byte } from "./nes/helpers";
import _ from "lodash";

import operations from "./nes/operations";
window.operations = operations;

const nesTestLogger = {
	log: ({
		context: { cpu, memory },
		pc,
		operation,
		initialParameter,
		finalParameter
	}) => {
		const hex = (value, length) =>
			_.padStart(value.toString(16).toUpperCase(), length, "0");
		const cycle = (value, length) => _.padStart(value.toString(), length);
		const section = (string, length) =>
			_.padEnd(string.substr(0, length), length);
		const wrapParameter = (value) => {
			switch (operation.addressing.id) {
				case "IMPLICIT":
					return "";
				case "IMMEDIATE":
					return `#$${value}`;
				case "INDEXED_ABSOLUTE_X":
				case "INDEXED_ZERO_PAGE_X":
					return `$${value},X`;
				case "INDEXED_ABSOLUTE_Y":
				case "INDEXED_ZERO_PAGE_Y":
					return `$${value},Y`;
				case "INDIRECT":
					return `($${value})`;
				case "INDEXED_INDIRECT_X":
					return `($${value},X)`;
				case "INDEXED_INDIRECT_Y":
					return `($${value}),Y`;
				case "ACCUMULATOR":
					return "A";
				default:
					return `$${value}`;
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

		let $hexParameter = "";
		if (operation.addressing.parameterSize > 0) {
			$hexParameter =
				operation.addressing.parameterSize === 2
					? hex(finalParameter, 4)
					: hex(finalParameter, 2);
		}
		const $assembly = section(
			operation.instruction.id + " " + wrapParameter($hexParameter),
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
	const logLines = logText.split("\n");

	const expected = document.querySelector("#expected");
	const actual = document.querySelector("#actual");
	let line = 0;
	window.onkeydown = () => {
		window.nes.step();
		actual.innerHTML += window.lastLog + "\n";
		expected.innerHTML += logLines[line] + "\n";
		document.body.scrollIntoView(false);
		line++;
	};
};

DEMO();
