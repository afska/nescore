import instructions from "../instructions";
import addressings from "../addressings";

export default [
	{
		id: 0x18,
		instruction: instructions.CLC,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xd8,
		instruction: instructions.CLD,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x58,
		instruction: instructions.CLI,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xb8,
		instruction: instructions.CLV,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0xa9,
		instruction: instructions.LDA,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0xa5,
		instruction: instructions.LDA,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xb5,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_X
	},
	{
		id: 0xad,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xbd,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_X,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0xb9,
		instruction: instructions.LDA,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0xa1,
		instruction: instructions.LDA,
		cycles: 6,
		addressing: addressings.INDEXED_INDIRECT_X
	},
	{
		id: 0xb1,
		instruction: instructions.LDA,
		cycles: 5,
		addressing: addressings.INDEXED_INDIRECT_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0xa2,
		instruction: instructions.LDX,
		cycles: 2,
		addressing: addressings.IMMEDIATE
	},
	{
		id: 0xa6,
		instruction: instructions.LDX,
		cycles: 3,
		addressing: addressings.ZERO_PAGE
	},
	{
		id: 0xb6,
		instruction: instructions.LDX,
		cycles: 4,
		addressing: addressings.INDEXED_ZERO_PAGE_Y
	},
	{
		id: 0xae,
		instruction: instructions.LDX,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	},
	{
		id: 0xbe,
		instruction: instructions.LDX,
		cycles: 4,
		addressing: addressings.INDEXED_ABSOLUTE_Y,
		extraCycleIfPageCrossed: true
	},
	{
		id: 0x78,
		instruction: instructions.SEI,
		cycles: 2,
		addressing: addressings.IMPLICIT
	},
	{
		id: 0x8d,
		instruction: instructions.STA,
		cycles: 4,
		addressing: addressings.ABSOLUTE
	}
];
