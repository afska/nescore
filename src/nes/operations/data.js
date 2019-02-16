import instructions from "../instructions";
import addressings from "../addressings";

export default [
	{
		id: 0x18,
		instruction: instructions.CLC,
		cycles: 2,
		addressing: addressings.NONE
	},
	{
		id: 0xd8,
		instruction: instructions.CLD,
		cycles: 2,
		addressing: addressings.NONE
	},
	{
		id: 0x58,
		instruction: instructions.CLI,
		cycles: 2,
		addressing: addressings.NONE
	},
	{
		id: 0xb8,
		instruction: instructions.CLV,
		cycles: 2,
		addressing: addressings.NONE
	},
	{
		id: 0xa9,
		instruction: instructions.LDA,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0x78,
		instruction: instructions.SEI,
		cycles: 2,
		addressing: addressings.NONE
	},
	{
		id: 0x8d,
		instruction: instructions.STA,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	}
];
