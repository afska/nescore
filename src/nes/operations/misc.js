import instructions from "../instructions";
import addressings from "../addressings";

export default [
	{
		id: 0x00,
		instruction: instructions.BRK,
		cycles: 0,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xea,
		instruction: instructions.NOP,
		cycles: 2,
		addressing: addressings.IMPLICIT
	}
];
