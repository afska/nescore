import instructions from "../instructions";
import addressings from "../addressings";

export default [
	{
		id: 0x90,
		instruction: instructions.BCC,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0xb0,
		instruction: instructions.BCS,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0xf0,
		instruction: instructions.BEQ,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0x30,
		instruction: instructions.BMI,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0xd0,
		instruction: instructions.BNE,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0x10,
		instruction: instructions.BPL,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0x50,
		instruction: instructions.BVC,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0x70,
		instruction: instructions.BVS,
		cycles: 2,
		addressing: addressings.RELATIVE,
		canTakeExtraCycles: true
	},
	{
		id: 0x4c,
		instruction: instructions.JMP,
		cycles: 3,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x6c,
		instruction: instructions.JMP,
		cycles: 5,
		addressing: addressings.INDIRECT
	},
	{
		id: 0x20,
		instruction: instructions.JSR,
		cycles: 6,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0x40,
		instruction: instructions.RTI,
		cycles: 6,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x60,
		instruction: instructions.RTS,
		cycles: 6,
		addressing: addressings.IMPLICIT
	}
];
