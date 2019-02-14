import addressings from "../addressings";

export default [
	{
		id: 0x18,
		instruction: "CLC",
		cycles: 2,
		addressing: null
	},
	{
		id: 0xd8,
		instruction: "CLD",
		cycles: 2,
		addressing: null
	},
	{
		id: 0x58,
		instruction: "CLI",
		cycles: 2,
		addressing: null
	},
	{
		id: 0xb8,
		instruction: "CLV",
		cycles: 2,
		addressing: null
	},
	{
		id: 0xa9,
		instruction: "LDA",
		cycles: 2,
		addressing: addressings.IMMEDIATE
	}
];
